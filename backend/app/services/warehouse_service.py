from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.warehouse import Warehouse
from repositories.base import BaseRepository
from schemas.misc import WarehouseCreate, WarehouseUpdate
from utils.exceptions import ConflictError, NotFoundError


class WarehouseService:
    def __init__(self, warehouse_repo=None) -> None:
        self.warehouse_repo = warehouse_repo or BaseRepository[Warehouse, WarehouseCreate, WarehouseUpdate](Warehouse)

    async def get_by_code(self, db: AsyncSession, code: str) -> Warehouse | None:
        result = await db.execute(select(Warehouse).where(Warehouse.code == code))
        return result.scalar_one_or_none()

    async def get_warehouse(self, db: AsyncSession, warehouse_id: int) -> Warehouse:
        warehouse = await self.warehouse_repo.get(db, warehouse_id)
        if not warehouse:
            raise NotFoundError(f"Warehouse with id {warehouse_id} not found")
        return warehouse

    async def list_warehouses(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 25
    ) -> tuple[list[Warehouse], int]:
        return await self.warehouse_repo.get_multi(db, skip=skip, limit=limit)

    async def create_warehouse(self, db: AsyncSession, *, obj_in: WarehouseCreate) -> Warehouse:
        existing = await self.get_by_code(db, obj_in.code)
        if existing:
            raise ConflictError(f"Warehouse with code {obj_in.code} already exists")
        return await self.warehouse_repo.create(db, obj_in=obj_in)

    async def update_warehouse(
        self, db: AsyncSession, warehouse_id: int, *, obj_in: WarehouseUpdate
    ) -> Warehouse:
        warehouse = await self.get_warehouse(db, warehouse_id)
        if obj_in.code and obj_in.code != warehouse.code:
            existing = await self.get_by_code(db, obj_in.code)
            if existing:
                raise ConflictError(f"Warehouse with code {obj_in.code} already exists")
        return await self.warehouse_repo.update(db, db_obj=warehouse, obj_in=obj_in)
