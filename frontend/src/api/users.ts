import client from './client';
import { User, UserCreate, UserUpdate } from '../types/user';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getUsers = async (params: { page?: number; page_size?: number } = {}): Promise<Paginated<User>> => {
  const { data } = await client.get('/users/', { params });
  return data as Paginated<User>;
};

export const createUser = async (payload: UserCreate): Promise<User> => {
  const { data } = await client.post('/users/', payload);
  return data as User;
};

export const updateUser = async (id: number, payload: UserUpdate): Promise<User> => {
  const { data } = await client.patch(`/users/${id}`, payload);
  return data as User;
};

export const deleteUser = async (id: number): Promise<void> => {
  await client.delete(`/users/${id}`);
};
