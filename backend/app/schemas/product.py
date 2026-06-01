from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class ProductBase(BaseModel):
    sku: str
    name: str
    description: str | None = None
    barcode: str | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    warehouse_id: int | None = None
    unit_cost: Decimal = Decimal("0.00")
    unit_price: Decimal = Decimal("0.00")
    quantity_on_hand: int = 0
    quantity_reserved: int = 0
    reorder_point: int = 10
    reorder_quantity: int = 50
    max_stock_level: int = 500
    weight_kg: float | None = None
    dimensions_cm: str | None = None
    unit_of_measure: str = "unit"
    is_active: bool = True
    is_serialized: bool = False
    notes: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: str | None = None
    name: str | None = None
    description: str | None = None
    barcode: str | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    warehouse_id: int | None = None
    unit_cost: Decimal | None = None
    unit_price: Decimal | None = None
    quantity_on_hand: int | None = None
    quantity_reserved: int | None = None
    reorder_point: int | None = None
    reorder_quantity: int | None = None
    max_stock_level: int | None = None
    weight_kg: float | None = None
    dimensions_cm: str | None = None
    unit_of_measure: str | None = None
    is_active: bool | None = None
    is_serialized: bool | None = None
    notes: str | None = None


class ProductRead(ProductBase):
    id: int
    quantity_available: int
    stock_value: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
