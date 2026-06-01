# File: chronosledger/backend/app/models/warehouse.py
from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin


class Warehouse(Base, TimestampMixin):
    __tablename__ = "warehouses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), default="US", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="warehouse")
    stock_movements: Mapped[list["StockMovement"]] = relationship("StockMovement", back_populates="warehouse")