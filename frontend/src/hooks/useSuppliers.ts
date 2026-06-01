import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/suppliers';
import { SupplierCreate, SupplierUpdate } from '../types/supplier';

export const SUPPLIERS_QUERY_KEY = ['suppliers'];

export function useSuppliers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, params ?? {}],
    queryFn: () => getSuppliers(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplierCreate) => createSupplier(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SupplierUpdate }) =>
      updateSupplier(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY }),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SUPPLIERS_QUERY_KEY }),
  });
}
