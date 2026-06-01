export interface Customer {
  id: number;
  name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  notes?: string;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {}
