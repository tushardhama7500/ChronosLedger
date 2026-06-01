from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from schemas.common import PaginatedResponse
from schemas.misc import WarehouseCreate, WarehouseRead, WarehouseUpdate
from services.warehouse_service import WarehouseService
from utils.pagination import build_paginated_response

router = APIRouter(prefix="/warehouses", tags=["warehouses"])
service = WarehouseService()


@router.get("/", response_model=PaginatedResponse[WarehouseRead])
async def list_warehouses(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[WarehouseRead]:
    skip = (page - 1) * page_size
    items, total = await service.list_warehouses(db, skip=skip, limit=page_size)
    return build_paginated_response(items, total, page, page_size)


@router.post("/", response_model=WarehouseRead, status_code=201)
async def create_warehouse(
    warehouse_in: WarehouseCreate,
    db: AsyncSession = Depends(get_db),
) -> WarehouseRead:
    return await service.create_warehouse(db, obj_in=warehouse_in)


@router.get("/{warehouse_id}", response_model=WarehouseRead)
async def get_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
) -> WarehouseRead:
    return await service.get_warehouse(db, warehouse_id)


@router.patch("/{warehouse_id}", response_model=WarehouseRead)
async def update_warehouse(
    warehouse_id: int,
    warehouse_in: WarehouseUpdate,
    db: AsyncSession = Depends(get_db),
) -> WarehouseRead:
    return await service.update_warehouse(db, warehouse_id, obj_in=warehouse_in)


@router.delete("/{warehouse_id}", status_code=204)
async def delete_warehouse(
    warehouse_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    await service.get_warehouse(db, warehouse_id)
    await service.warehouse_repo.remove(db, id=warehouse_id)
