export interface Supplier {
  id: number;
  name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  lead_time_days: number;
  reliability_score: number;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierCreate {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  lead_time_days?: number;
  reliability_score?: number;
  notes?: string;
  is_active?: boolean;
}

export interface SupplierUpdate extends Partial<SupplierCreate> {}
