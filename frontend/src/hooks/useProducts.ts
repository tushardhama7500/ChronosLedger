import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import { ProductCreate, ProductUpdate } from '../types/product';

export const PRODUCTS_QUERY_KEY = ['products'];

export function useProducts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params ?? {}],
    queryFn: () => getProducts(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'detail', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductCreate) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductUpdate }) => updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}
