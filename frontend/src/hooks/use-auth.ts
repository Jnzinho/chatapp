import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '#/lib/api';
import type { User } from '#/types';

export const AUTH_QUERY_KEY = ['auth', 'me'];

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => api.get('/auth/me'),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<User>('/auth/login', data),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.post<User>('/auth/register', data),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
