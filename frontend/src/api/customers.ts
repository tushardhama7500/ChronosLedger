import client from './client';
import { Customer, CustomerCreate, CustomerUpdate } from '../types/customer';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getCustomers = async (params: { page?: number; page_size?: number } = {}): Promise<Paginated<Customer>> => {
  const { data } = await client.get('/customers', { params });
  return data as Paginated<Customer>;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const { data } = await client.get(`/customers/${id}`);
  return data as Customer;
};

export const createCustomer = async (payload: CustomerCreate): Promise<Customer> => {
  const { data } = await client.post('/customers', payload);
  return data as Customer;
};

export const updateCustomer = async (id: number, payload: CustomerUpdate): Promise<Customer> => {
  const { data } = await client.patch(`/customers/${id}`, payload);
  return data as Customer;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await client.delete(`/customers/${id}`);
};
