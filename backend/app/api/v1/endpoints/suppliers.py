from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.supplier import Supplier
from repositories.base import BaseRepository
from schemas.common import PaginatedResponse
from schemas.misc import SupplierCreate, SupplierRead, SupplierUpdate
from utils.exceptions import ConflictError, NotFoundError
from utils.pagination import build_paginated_response

router = APIRouter(prefix="/suppliers", tags=["suppliers"])
supplier_repository = BaseRepository[Supplier, SupplierCreate, SupplierUpdate](Supplier)


async def get_supplier_by_name(db: AsyncSession, name: str) -> Supplier | None:
    result = await db.execute(select(Supplier).where(Supplier.name == name))
    return result.scalar_one_or_none()


@router.get("/", response_model=PaginatedResponse[SupplierRead])
async def list_suppliers(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[SupplierRead]:
    skip = (page - 1) * page_size
    items, total = await supplier_repository.get_multi(db, skip=skip, limit=page_size)
    return build_paginated_response(items, total, page, page_size)


@router.post("/", response_model=SupplierRead, status_code=201)
async def create_supplier(
    supplier_in: SupplierCreate,
    db: AsyncSession = Depends(get_db),
) -> SupplierRead:
    existing = await get_supplier_by_name(db, supplier_in.name)
    if existing:
        raise ConflictError(f"Supplier with name {supplier_in.name} already exists")
    return await supplier_repository.create(db, obj_in=supplier_in)


@router.get("/{supplier_id}", response_model=SupplierRead)
async def get_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
) -> SupplierRead:
    supplier = await supplier_repository.get(db, supplier_id)
    if not supplier:
        raise NotFoundError(f"Supplier with id {supplier_id} not found")
    return supplier


@router.patch("/{supplier_id}", response_model=SupplierRead)
async def update_supplier(
    supplier_id: int,
    supplier_in: SupplierUpdate,
    db: AsyncSession = Depends(get_db),
) -> SupplierRead:
    supplier = await supplier_repository.get(db, supplier_id)
    if not supplier:
        raise NotFoundError(f"Supplier with id {supplier_id} not found")
    return await supplier_repository.update(db, db_obj=supplier, obj_in=supplier_in)


@router.delete("/{supplier_id}", status_code=204)
async def delete_supplier(
    supplier_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    supplier = await supplier_repository.get(db, supplier_id)
    if not supplier:
        raise NotFoundError(f"Supplier with id {supplier_id} not found")
    await supplier_repository.remove(db, id=supplier_id)
