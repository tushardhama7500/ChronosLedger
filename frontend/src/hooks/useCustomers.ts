import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';
import { CustomerCreate, CustomerUpdate } from '../types/customer';

export const CUSTOMERS_QUERY_KEY = ['customers'];

export function useCustomers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, params ?? {}],
    queryFn: () => getCustomers(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, 'detail', id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerCreate) => createCustomer(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CustomerUpdate }) => updateCustomer(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY }),
  });
}
