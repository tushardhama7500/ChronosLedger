import client from './client';
import {
  Order,
  OrderCreate,
  OrderSummary,
  OrderUpdate,
} from '../types/order';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getOrders = async (params: {
  order_type?: string;
  status?: string;
  supplier_id?: number;
  page?: number;
  page_size?: number;
} = {}): Promise<Paginated<OrderSummary>> => {
  const { data } = await client.get('/orders', { params });
  return data as Paginated<OrderSummary>;
};

export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await client.get(`/orders/${id}`);
  return data as Order;
};

export const createOrder = async (payload: OrderCreate): Promise<Order> => {
  const { data } = await client.post('/orders', payload);
  return data as Order;
};

export const updateOrder = async (id: number, payload: OrderUpdate): Promise<Order> => {
  const { data } = await client.patch(`/orders/${id}`, payload);
  return data as Order;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await client.delete(`/orders/${id}`);
};
