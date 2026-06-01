from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from schemas.common import PaginatedResponse
from schemas.product import ProductCreate, ProductRead, ProductUpdate
from services.product_service import ProductService
from utils.pagination import build_paginated_response

router = APIRouter(prefix="/products", tags=["products"])
service = ProductService()


@router.get("/", response_model=PaginatedResponse[ProductRead])
async def list_products(
    query: str | None = Query(None),
    category_id: int | None = Query(None),
    supplier_id: int | None = Query(None),
    warehouse_id: int | None = Query(None),
    is_active: bool | None = Query(None),
    low_stock_only: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ProductRead]:
    skip = (page - 1) * page_size
    items, total = await service.search_products(
        db,
        query=query,
        category_id=category_id,
        supplier_id=supplier_id,
        warehouse_id=warehouse_id,
        is_active=is_active,
        low_stock_only=low_stock_only,
        skip=skip,
        limit=page_size,
    )
    return build_paginated_response(items, total, page, page_size)


@router.post("/", response_model=ProductRead, status_code=201)
async def create_product(
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    return await service.create_product(db, obj_in=product_in)


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)) -> ProductRead:
    return await service.get_product(db, product_id)


@router.patch("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    return await service.update_product(db, product_id, obj_in=product_in)
