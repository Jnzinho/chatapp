import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth';
import { createSocket, type AppSocket } from '#/lib/socket';
import { showMessageToast } from '#/components/ui/notification-toast';
import type { Message, User } from '#/types';

type SocketContextType = {
  unreadCounts: Map<string, number>;
  markAsRead: (userId: string) => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<AppSocket | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(
    new Map()
  );

  const markAsRead = useCallback((userId: string) => {
    setUnreadCounts((prev) => {
      if (!prev.has(userId) || prev.get(userId) === 0) return prev;
      const next = new Map(prev);
      next.set(userId, 0);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      setUnreadCounts(new Map());
      return;
    }

    if (!socketRef.current) {
      socketRef.current = createSocket();
    }

    const socket = socketRef.current;
    socket.connect();

    socket.on('message:new', (message: Message) => {
      const senderId = message.sender;

      queryClient.setQueryData<Message[]>(['messages', senderId], (old) =>
        old ? [...old, message] : [message]
      );

      const activeUserId = getActiveUserId();
      if (senderId !== activeUserId) {
        setUnreadCounts((prev) => {
          const next = new Map(prev);
          next.set(senderId, (next.get(senderId) ?? 0) + 1);
          return next;
        });

        const users = queryClient.getQueryData<User[]>(['users']);
        const sender = users?.find((u) => u._id === senderId);

        showMessageToast({
          userId: senderId,
          senderName: sender?.name ?? 'Novo contato',
          senderAvatar: sender?.avatar ?? '',
          content: message.content,
          onRead: markAsRead,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    socket.on('user:online', (userId: string) => {
      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.map((u) => (u._id === userId ? { ...u, online: true } : u))
      );
    });

    socket.on('user:offline', (userId: string) => {
      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.map((u) => (u._id === userId ? { ...u, online: false } : u))
      );
    });

    return () => {
      socket.off('message:new');
      socket.off('user:online');
      socket.off('user:offline');
      socket.disconnect();
    };
  }, [user, queryClient, markAsRead]);

  return (
    <SocketContext value={{ unreadCounts, markAsRead }}>
      {children}
    </SocketContext>
  );
}

export function useSocket(): SocketContextType {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}

function getActiveUserId(): string | undefined {
  const match = window.location.pathname.match(/\/chat\/([^/]+)/);
  return match?.[1];
}
