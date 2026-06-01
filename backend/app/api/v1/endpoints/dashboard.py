from fastapi import APIRouter, Depends
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from models.order import Order, OrderStatus
from models.product import Product
from models.stock_movement import StockMovement
from schemas.misc import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)) -> DashboardStats:
    total_products = (await db.execute(select(func.count()).select_from(Product))).scalar_one()
    active_products = (
        await db.execute(select(func.count()).select_from(Product).where(Product.is_active == True))
    ).scalar_one()
    low_stock_count = (
        await db.execute(
            select(func.count()).select_from(Product).where(Product.quantity_on_hand <= Product.reorder_point)
        )
    ).scalar_one()
    out_of_stock_count = (
        await db.execute(
            select(func.count()).select_from(Product).where(Product.quantity_on_hand == 0)
        )
    ).scalar_one()
    total_inventory_value = float(
        (await db.execute(select(func.coalesce(func.sum(Product.unit_cost * Product.quantity_on_hand), 0)))).scalar_one()
    )
    total_orders = (await db.execute(select(func.count()).select_from(Order))).scalar_one()
    pending_orders = int(
        (await db.execute(
            select(func.count())
            .select_from(Order)
            .where(Order.status.in_([
                OrderStatus.DRAFT,
                OrderStatus.CONFIRMED,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
            ]))
        )).scalar_one()
    )
    orders_this_month = int(
        (await db.execute(text("SELECT COUNT(*) FROM orders WHERE created_at >= date_trunc('month', NOW())"))).scalar_one()
    )
    revenue_this_month = float(
        (await db.execute(text("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= date_trunc('month', NOW())"))).scalar_one()
    )

    top_low_stock_products = [
        {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "quantity_on_hand": product.quantity_on_hand,
            "reorder_point": product.reorder_point,
        }
        for product in (
            await db.execute(
                select(Product)
                .where(Product.quantity_on_hand <= Product.reorder_point)
                .order_by(Product.quantity_on_hand.asc())
                .limit(5)
            )
        ).scalars().all()
    ]

    recent_movements = [
        {
            "id": movement.id,
            "product_id": movement.product_id,
            "warehouse_id": movement.warehouse_id,
            "order_id": movement.order_id,
            "movement_type": movement.movement_type.value,
            "quantity": movement.quantity,
            "reference": movement.reference,
            "created_at": movement.created_at.isoformat(),
        }
        for movement in (
            await db.execute(
                select(StockMovement)
                .order_by(StockMovement.created_at.desc())
                .limit(10)
            )
        ).scalars().all()
    ]

    order_status_rows = (
        await db.execute(select(Order.status, func.count()).group_by(Order.status))
    ).all()
    order_status_breakdown = {row[0].value: row[1] for row in order_status_rows}

    monthly_order_trend = [
        {
            "month": row.month,
            "order_count": int(row.order_count),
            "total_revenue": float(row.total_revenue),
        }
        for row in (
            await db.execute(
                text(
                    "SELECT TO_CHAR(date_trunc('month', created_at), 'YYYY-MM') AS month, COUNT(*) AS order_count, COALESCE(SUM(total_amount), 0) AS total_revenue"
                    " FROM orders"
                    " WHERE created_at >= date_trunc('month', NOW()) - INTERVAL '5 months'"
                    " GROUP BY month"
                    " ORDER BY month ASC"
                )
            )
        ).fetchall()
    ]

    return DashboardStats(
        total_products=total_products,
        active_products=active_products,
        low_stock_count=low_stock_count,
        out_of_stock_count=out_of_stock_count,
        total_inventory_value=total_inventory_value,
        total_orders=total_orders,
        pending_orders=pending_orders,
        orders_this_month=orders_this_month,
        revenue_this_month=revenue_this_month,
        top_low_stock_products=top_low_stock_products,
        recent_movements=recent_movements,
        order_status_breakdown=order_status_breakdown,
        monthly_order_trend=monthly_order_trend,
    )
