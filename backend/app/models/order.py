# File: chronosledger/backend/app/models/order.py
import enum
from datetime import datetime

from sqlalchemy import String, Text, Numeric, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin


class OrderType(str, enum.Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    TRANSFER = "transfer"
    RETURN = "return"


class OrderStatus(str, enum.Enum):
    DRAFT = "draft"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    order_type: Mapped[OrderType] = mapped_column(
        Enum(
            OrderType,
            native_enum=False,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
    )
    status: Mapped[OrderStatus] = mapped_column(
        Enum(
            OrderStatus,
            native_enum=False,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        default=OrderStatus.DRAFT,
        nullable=False,
        index=True,
    )

    supplier_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True
    )
    created_by: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    reference_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    subtotal: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    shipping_cost: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    discount_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)

    expected_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    shipped_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    shipping_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    tracking_number: Mapped[str | None] = mapped_column(String(100), nullable=True)

    supplier: Mapped["Supplier | None"] = relationship("Supplier", back_populates="orders")
    created_by_user: Mapped["User | None"] = relationship("User", back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False
    )

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_received: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    discount_percent: Mapped[float] = mapped_column(Numeric(5, 2), default=0.0, nullable=False)
    line_total: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="order_items")