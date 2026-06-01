import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../api/warehouses';
import { WarehouseCreate, WarehouseUpdate } from '../types/warehouse';

export const WAREHOUSES_QUERY_KEY = ['warehouses'];

export function useWarehouses(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, params ?? {}],
    queryFn: () => getWarehouses(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WarehouseCreate) => createWarehouse(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useUpdateWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WarehouseUpdate }) =>
      updateWarehouse(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}
