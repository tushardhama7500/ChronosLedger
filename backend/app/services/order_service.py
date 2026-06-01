from datetime import datetime
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order, OrderItem, OrderStatus, OrderType
from repositories.order import order_repository
from repositories.product import product_repository
from schemas.order import OrderCreate, OrderUpdate
from utils.exceptions import BadRequestError, NotFoundError


class OrderService:
    def __init__(
        self,
        order_repo=order_repository,
        product_repo=product_repository,
    ) -> None:
        self.order_repo = order_repo
        self.product_repo = product_repo

    async def get_order(self, db: AsyncSession, order_id: int) -> Order:
        order = await self.order_repo.get_with_items(db, order_id)
        if not order:
            raise NotFoundError(f"Order with id {order_id} not found")
        return order

    async def search_orders(
        self,
        db: AsyncSession,
        *,
        order_type: OrderType | None = None,
        status: OrderStatus | None = None,
        supplier_id: int | None = None,
        skip: int = 0,
        limit: int = 25,
    ) -> tuple[list[Order], int]:
        return await self.order_repo.search(
            db,
            order_type=order_type,
            status=status,
            supplier_id=supplier_id,
            skip=skip,
            limit=limit,
        )

    async def create_order(
        self,
        db: AsyncSession,
        *,
        order_in: OrderCreate,
        created_by: int | None = None,
    ) -> Order:
        subtotal = Decimal("0.00")
        order_items: list[OrderItem] = []

        for item in order_in.items:
            if item.quantity < 1:
                raise BadRequestError("Order item quantity must be at least 1")

            product = await self.product_repo.get(db, item.product_id)
            if not product:
                raise NotFoundError(f"Product with id {item.product_id} not found")

            discount_multiplier = Decimal("1") - item.discount_percent / Decimal("100")
            line_total = (
                Decimal(item.quantity) * item.unit_price * discount_multiplier
            ).quantize(Decimal("0.01"))
            subtotal += line_total

            if order_in.order_type == OrderType.SALE:
                await self.product_repo.update_stock(db, product.id, -item.quantity)
            elif order_in.order_type == OrderType.PURCHASE:
                await self.product_repo.update_stock(db, product.id, item.quantity)

            order_items.append(
                OrderItem(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=float(item.unit_price),
                    discount_percent=float(item.discount_percent),
                    quantity_received=0,
                    line_total=float(line_total),
                    notes=item.notes,
                )
            )

        total_amount = float(
            (subtotal + order_in.shipping_cost - order_in.discount_amount).quantize(Decimal("0.01"))
        )

        order = Order(
            order_number=self._generate_order_number(order_in.order_type),
            order_type=order_in.order_type,
            supplier_id=order_in.supplier_id,
            created_by=created_by,
            reference_number=order_in.reference_number,
            notes=order_in.notes,
            shipping_cost=float(order_in.shipping_cost),
            discount_amount=float(order_in.discount_amount),
            subtotal=float(subtotal),
            tax_amount=0.0,
            total_amount=total_amount,
            expected_date=order_in.expected_date,
            shipping_address=order_in.shipping_address,
        )

        db.add(order)
        await db.flush()

        for item in order_items:
            item.order = order
            db.add(item)

        await db.flush()
        await db.refresh(order)

        loaded_order = await self.order_repo.get_with_items(db, order.id)
        if not loaded_order:
            raise NotFoundError("Order created but could not be loaded")

        return loaded_order

    async def update_order(
        self,
        db: AsyncSession,
        order_id: int,
        *,
        order_in: OrderUpdate,
    ) -> Order:
        order = await self.order_repo.get(db, order_id)
        if not order:
            raise NotFoundError(f"Order with id {order_id} not found")

        update_data = order_in.model_dump(exclude_unset=True)
        return await self.order_repo.update(db, db_obj=order, obj_in=update_data)

    def _generate_order_number(self, order_type: OrderType) -> str:
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        return f"{order_type.value[:3].upper()}-{timestamp}"
