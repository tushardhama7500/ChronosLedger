# File: chronosledger/backend/app/schemas/misc.py
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel

from models.stock_movement import MovementType


class CategoryBase(BaseModel):
    name: str
    description: str | None = None
    parent_id: int | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    parent_id: int | None = None


class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SupplierBase(BaseModel):
    name: str
    contact_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    lead_time_days: int = 7
    reliability_score: Decimal = Decimal("5.0")
    notes: str | None = None
    is_active: bool = True


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    name: str | None = None
    contact_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    lead_time_days: int | None = None
    reliability_score: Decimal | None = None
    notes: str | None = None
    is_active: bool | None = None


class SupplierRead(SupplierBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class WarehouseBase(BaseModel):
    name: str
    code: str
    address: str | None = None
    city: str | None = None
    country: str = "US"
    is_active: bool = True
    notes: str | None = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    is_active: bool | None = None
    notes: str | None = None


class WarehouseRead(WarehouseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class StockMovementCreate(BaseModel):
    product_id: int
    warehouse_id: int | None = None
    movement_type: MovementType
    quantity: int
    unit_cost: Decimal | None = None
    reference: str | None = None
    reason: str | None = None


class StockMovementRead(BaseModel):
    id: int
    product_id: int
    warehouse_id: int | None
    order_id: int | None
    performed_by: int | None
    movement_type: MovementType
    quantity: int
    quantity_before: int
    quantity_after: int
    unit_cost: Decimal | None
    reference: str | None
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    total_products: int
    active_products: int
    low_stock_count: int
    out_of_stock_count: int
    total_inventory_value: float
    total_orders: int
    pending_orders: int
    orders_this_month: int
    revenue_this_month: float
    top_low_stock_products: list[dict]
    recent_movements: list[dict]
    order_status_breakdown: dict[str, int]
    monthly_order_trend: list[dict]