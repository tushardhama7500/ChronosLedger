import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../api/orders';
import { OrderCreate, OrderUpdate } from '../types/order';

export const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params ?? {}],
    queryFn: () => getOrders(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'detail', id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrderCreate) => createOrder(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OrderUpdate }) => updateOrder(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });
}
