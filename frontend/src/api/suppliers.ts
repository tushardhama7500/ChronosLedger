import client from './client';
import { Supplier, SupplierCreate, SupplierUpdate } from '../types/supplier';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getSuppliers = async (params: { page?: number; page_size?: number } = {}): Promise<Paginated<Supplier>> => {
  const { data } = await client.get('/suppliers', { params });
  return data as Paginated<Supplier>;
};

export const createSupplier = async (payload: SupplierCreate): Promise<Supplier> => {
  const { data } = await client.post('/suppliers', payload);
  return data as Supplier;
};

export const updateSupplier = async (id: number, payload: SupplierUpdate): Promise<Supplier> => {
  const { data } = await client.patch(`/suppliers/${id}`, payload);
  return data as Supplier;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await client.delete(`/suppliers/${id}`);
};
