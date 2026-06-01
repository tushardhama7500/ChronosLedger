export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  barcode?: string | null;
  category_id?: number | null;
  supplier_id?: number | null;
  warehouse_id?: number | null;
  unit_cost: number;
  unit_price: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  reorder_point: number;
  reorder_quantity: number;
  max_stock_level: number;
  weight_kg?: number | null;
  dimensions_cm?: string | null;
  unit_of_measure: string;
  is_active: boolean;
  is_serialized: boolean;
  notes?: string | null;
  quantity_available?: number;
  stock_value?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  sku: string;
  name: string;
  description?: string;
  barcode?: string;
  category_id?: number;
  supplier_id?: number;
  warehouse_id?: number;
  unit_cost?: number;
  unit_price?: number;
  quantity_on_hand?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  max_stock_level?: number;
  weight_kg?: number;
  dimensions_cm?: string;
  unit_of_measure?: string;
  is_active?: boolean;
  is_serialized?: boolean;
  notes?: string;
}

export interface ProductUpdate extends Partial<ProductCreate> {}
