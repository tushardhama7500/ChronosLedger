from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.order import OrderStatus, OrderType
from schemas.common import PaginatedResponse
from schemas.order import OrderCreate, OrderRead, OrderSummary, OrderUpdate
from services.order_service import OrderService
from utils.pagination import build_paginated_response

router = APIRouter(prefix="/orders", tags=["orders"])
service = OrderService()


@router.get("/", response_model=PaginatedResponse[OrderSummary])
async def list_orders(
    order_type: OrderType | None = Query(None),
    status: OrderStatus | None = Query(None),
    supplier_id: int | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[OrderSummary]:
    skip = (page - 1) * page_size
    items, total = await service.search_orders(
        db,
        order_type=order_type,
        status=status,
        supplier_id=supplier_id,
        skip=skip,
        limit=page_size,
    )
    return build_paginated_response(items, total, page, page_size)


@router.post("/", response_model=OrderRead, status_code=201)
async def create_order(
    order_in: OrderCreate,
    db: AsyncSession = Depends(get_db),
) -> OrderRead:
    return await service.create_order(db, order_in=order_in)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)) -> OrderRead:
    return await service.get_order(db, order_id)


@router.patch("/{order_id}", response_model=OrderRead)
async def update_order(
    order_id: int,
    order_in: OrderUpdate,
    db: AsyncSession = Depends(get_db),
) -> OrderRead:
    return await service.update_order(db, order_id, order_in=order_in)
