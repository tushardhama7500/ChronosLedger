import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { UserCreate, UserUpdate } from '../types/user';

export const USERS_QUERY_KEY = ['users'];

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params ?? {}],
    queryFn: () => getUsers(params as any),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreate) => createUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserUpdate }) =>
      updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}
