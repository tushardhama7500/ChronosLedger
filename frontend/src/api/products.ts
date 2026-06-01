import client from './client';
import {
  Product,
  ProductCreate,
  ProductUpdate,
} from '../types/product';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getProducts = async (
  params: {
    query?: string;
    category_id?: number;
    supplier_id?: number;
    warehouse_id?: number;
    is_active?: boolean;
    low_stock_only?: boolean;
    page?: number;
    page_size?: number;
  } = {},
): Promise<Paginated<Product>> => {
  const { data } = await client.get('/products', { params });
  return data as Paginated<Product>;
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await client.get(`/products/${id}`);
  return data as Product;
};

export const createProduct = async (payload: ProductCreate): Promise<Product> => {
  const { data } = await client.post('/products', payload);
  return data as Product;
};

export const updateProduct = async (id: number, payload: ProductUpdate): Promise<Product> => {
  const { data } = await client.patch(`/products/${id}`, payload);
  return data as Product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await client.delete(`/products/${id}`);
};
