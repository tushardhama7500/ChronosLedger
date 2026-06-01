# File: chronosledger/backend/app/models/supplier.py
from sqlalchemy import String, Text, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base, TimestampMixin


class Supplier(Base, TimestampMixin):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    contact_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    lead_time_days: Mapped[int] = mapped_column(default=7, nullable=False)
    reliability_score: Mapped[float] = mapped_column(Numeric(3, 2), default=5.0, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="supplier")
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="supplier")