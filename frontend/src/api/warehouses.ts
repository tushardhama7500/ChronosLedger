import client from './client';
import { Warehouse, WarehouseCreate, WarehouseUpdate } from '../types/warehouse';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getWarehouses = async (params: { page?: number; page_size?: number } = {}): Promise<Paginated<Warehouse>> => {
  const { data } = await client.get('/warehouses', { params });
  return data as Paginated<Warehouse>;
};

export const createWarehouse = async (payload: WarehouseCreate): Promise<Warehouse> => {
  const { data } = await client.post('/warehouses', payload);
  return data as Warehouse;
};

export const updateWarehouse = async (id: number, payload: WarehouseUpdate): Promise<Warehouse> => {
  const { data } = await client.patch(`/warehouses/${id}`, payload);
  return data as Warehouse;
};

export const deleteWarehouse = async (id: number): Promise<void> => {
  await client.delete(`/warehouses/${id}`);
};
