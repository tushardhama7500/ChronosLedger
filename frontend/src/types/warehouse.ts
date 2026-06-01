export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  country: string;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WarehouseCreate {
  name: string;
  code: string;
  address?: string;
  city?: string;
  country?: string;
  is_active?: boolean;
  notes?: string;
}

export interface WarehouseUpdate extends Partial<WarehouseCreate> {}
