export interface DashboardStats {
  total_products: number;
  active_products: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_inventory_value: number;
  total_orders: number;
  pending_orders: number;
  orders_this_month: number;
  revenue_this_month: number;
  top_low_stock_products: Array<{ id: number; name: string; quantity_on_hand: number }>;
  recent_movements: Array<Record<string, unknown>>;
  order_status_breakdown: Record<string, number>;
  monthly_order_trend: Array<{ month: string; order_count: number; total_revenue: number }>;
}
