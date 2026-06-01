# File: chronosledger/backend/app/repositories/order.py
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.order import Order, OrderItem, OrderStatus, OrderType
from repositories.base import BaseRepository
from schemas.order import OrderCreate, OrderUpdate


class OrderRepository(BaseRepository[Order, OrderCreate, OrderUpdate]):
    async def get_with_items(self, db: AsyncSession, id: int) -> Order | None:
        result = await db.execute(
            select(Order)
            .options(
                selectinload(Order.items).selectinload(OrderItem.product),
                selectinload(Order.supplier),
                selectinload(Order.created_by_user),
            )
            .where(Order.id == id)
        )
        return result.scalar_one_or_none()

    async def get_by_order_number(self, db: AsyncSession, order_number: str) -> Order | None:
        result = await db.execute(
            select(Order).where(Order.order_number == order_number)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        db: AsyncSession,
        *,
        order_type: OrderType | None = None,
        status: OrderStatus | None = None,
        supplier_id: int | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[Order], int]:
        filters = []
        if order_type is not None:
            filters.append(Order.order_type == order_type)
        if status is not None:
            filters.append(Order.status == status)
        if supplier_id is not None:
            filters.append(Order.supplier_id == supplier_id)

        base_query = select(Order).where(and_(*filters)) if filters else select(Order)

        count_result = await db.execute(
            select(func.count()).select_from(base_query.subquery())
        )
        total = count_result.scalar_one()

        result = await db.execute(
            base_query
            .options(selectinload(Order.items))
            .offset(skip)
            .limit(limit)
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all(), total

    async def count_by_status(self, db: AsyncSession) -> dict[str, int]:
        result = await db.execute(
            select(Order.status, func.count(Order.id)).group_by(Order.status)
        )
        return {row[0].value: row[1] for row in result.fetchall()}

    async def get_monthly_trend(self, db: AsyncSession, months: int = 6) -> list[dict]:
        from sqlalchemy import extract, cast, Date, text
        result = await db.execute(
            text("""
                SELECT
                    DATE_TRUNC('month', created_at) AS month,
                    COUNT(*) AS order_count,
                    SUM(total_amount) AS total_revenue
                FROM orders
                WHERE created_at >= NOW() - INTERVAL ':months months'
                GROUP BY DATE_TRUNC('month', created_at)
                ORDER BY month ASC
            """).bindparams(months=months)
        )
        rows = result.fetchall()
        return [
            {
                "month": str(row[0])[:7],
                "order_count": int(row[1]),
                "total_revenue": float(row[2] or 0),
            }
            for row in rows
        ]


class OrderItemRepository(BaseRepository[OrderItem, None, None]):
    pass


order_repository = OrderRepository(Order)
order_item_repository = OrderItemRepository(OrderItem)