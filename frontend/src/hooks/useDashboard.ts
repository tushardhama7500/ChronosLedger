import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import { DashboardStats } from '../types/dashboard';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'stats'];

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => getDashboardStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
