# File: chronosledger/backend/app/models/stock_movement.py
import enum

from sqlalchemy import String, Text, Numeric, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin


class MovementType(str, enum.Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"
    ADJUSTMENT = "adjustment"
    TRANSFER = "transfer"
    RETURN = "return"
    WRITE_OFF = "write_off"


class StockMovement(Base, TimestampMixin):
    __tablename__ = "stock_movements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("products.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    warehouse_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True
    )
    order_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("orders.id", ondelete="SET NULL"), nullable=True
    )
    performed_by: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    movement_type: Mapped[MovementType] = mapped_column(
        Enum(
            MovementType,
            native_enum=False,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        index=True,
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_before: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity_after: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_cost: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    reference: Mapped[str | None] = mapped_column(String(100), nullable=True)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="stock_movements")
    warehouse: Mapped["Warehouse | None"] = relationship("Warehouse", back_populates="stock_movements")