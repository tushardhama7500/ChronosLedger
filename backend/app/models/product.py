# File: chronosledger/backend/app/models/product.py
from sqlalchemy import String, Text, Numeric, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sku: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    barcode: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)

    category_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    supplier_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True
    )
    warehouse_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True
    )

    unit_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2), default=0.0, nullable=False)
    quantity_on_hand: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    quantity_reserved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reorder_point: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    reorder_quantity: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    max_stock_level: Mapped[int] = mapped_column(Integer, default=500, nullable=False)

    weight_kg: Mapped[float | None] = mapped_column(Numeric(8, 3), nullable=True)
    dimensions_cm: Mapped[str | None] = mapped_column(String(50), nullable=True)
    unit_of_measure: Mapped[str] = mapped_column(String(30), default="unit", nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_serialized: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    category: Mapped["Category | None"] = relationship("Category", back_populates="products")
    supplier: Mapped["Supplier | None"] = relationship("Supplier", back_populates="products")
    warehouse: Mapped["Warehouse | None"] = relationship("Warehouse", back_populates="products")
    order_items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="product")
    stock_movements: Mapped[list["StockMovement"]] = relationship("StockMovement", back_populates="product")

    @property
    def quantity_available(self) -> int:
        return self.quantity_on_hand - self.quantity_reserved

    @property
    def is_low_stock(self) -> bool:
        return self.quantity_on_hand <= self.reorder_point

    @property
    def stock_value(self) -> float:
        return float(self.unit_cost) * self.quantity_on_hand