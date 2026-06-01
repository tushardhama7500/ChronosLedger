# File: chronosledger/backend/app/schemas/order.py
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from models.order import OrderStatus, OrderType


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    discount_percent: Decimal = Decimal("0.00")
    notes: str | None = None


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemUpdate(BaseModel):
    quantity: int | None = None
    unit_price: Decimal | None = None
    discount_percent: Decimal | None = None
    quantity_received: int | None = None
    notes: str | None = None


class OrderItemRead(OrderItemBase):
    id: int
    order_id: int
    quantity_received: int
    line_total: Decimal
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderBase(BaseModel):
    order_type: OrderType
    supplier_id: int | None = None
    reference_number: str | None = None
    notes: str | None = None
    shipping_cost: Decimal = Decimal("0.00")
    discount_amount: Decimal = Decimal("0.00")
    expected_date: datetime | None = None
    shipping_address: str | None = None


class OrderCreate(OrderBase):
    items: list[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: OrderStatus | None = None
    supplier_id: int | None = None
    reference_number: str | None = None
    notes: str | None = None
    shipping_cost: Decimal | None = None
    discount_amount: Decimal | None = None
    expected_date: datetime | None = None
    shipped_date: datetime | None = None
    delivered_date: datetime | None = None
    shipping_address: str | None = None
    tracking_number: str | None = None


class OrderRead(OrderBase):
    id: int
    order_number: str
    status: OrderStatus
    created_by: int | None
    subtotal: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    shipped_date: datetime | None
    delivered_date: datetime | None
    tracking_number: str | None
    items: list[OrderItemRead]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderSummary(BaseModel):
    id: int
    order_number: str
    order_type: OrderType
    status: OrderStatus
    total_amount: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}