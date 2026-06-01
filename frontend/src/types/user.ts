export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role?: string;
  is_active?: boolean;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}
