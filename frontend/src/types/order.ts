export enum OrderType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  TRANSFER = 'transfer',
  RETURN = 'return',
}

export enum OrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  notes?: string | null;
}

export interface OrderCreate {
  order_type: OrderType;
  supplier_id?: number | null;
  reference_number?: string | null;
  notes?: string | null;
  shipping_cost?: number;
  discount_amount?: number;
  expected_date?: string | null; // ISO date
  shipping_address?: string | null;
  items: OrderItemCreate[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  quantity_received: number;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  supplier_id?: number | null;
  created_by?: number | null;
  reference_number?: string | null;
  notes?: string | null;
  shipping_cost: number;
  discount_amount: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  expected_date?: string | null;
  shipped_date?: string | null;
  delivered_date?: string | null;
  tracking_number?: string | null;
  shipping_address?: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderSummary {
  id: number;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
}

export interface OrderUpdate {
  status?: OrderStatus;
  supplier_id?: number | null;
  reference_number?: string | null;
  notes?: string | null;
  shipping_cost?: number;
  discount_amount?: number;
  expected_date?: string | null;
  shipped_date?: string | null;
  delivered_date?: string | null;
  shipping_address?: string | null;
  tracking_number?: string | null;
}
