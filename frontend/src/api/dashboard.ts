import client from './client';
import { DashboardStats } from '../types/dashboard';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await client.get('/dashboard/stats');
  return data as DashboardStats;
};
