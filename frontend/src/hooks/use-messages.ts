import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '#/lib/api';
import type { Message } from '#/types';

export function useMessages(userId: string) {
  return useQuery<Message[]>({
    queryKey: ['messages', userId],
    queryFn: () => api.get(`/messages/${userId}`),
    enabled: !!userId,
  });
}

export function useSendMessage(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      api.post<Message>(`/messages/${userId}`, { content }),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(['messages', userId], (old) =>
        old ? [...old, newMessage] : [newMessage],
      );
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
