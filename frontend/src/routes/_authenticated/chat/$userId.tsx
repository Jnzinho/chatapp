import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { ChatHeader } from '#/components/chat/chat-header';
import { MessageBubble } from '#/components/chat/message-bubble';
import { MessageInput } from '#/components/chat/message-input';
import { useAuth } from '#/contexts/auth';
import { useSocket } from '#/contexts/socket';
import { useMessages, useSendMessage } from '#/hooks/use-messages';
import { useIsMobile } from '#/hooks/use-mobile';
import { useUsers } from '#/hooks/use-users';

export const Route = createFileRoute('/_authenticated/chat/$userId')({
  component: ChatRoom,
});

function ChatRoom() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markAsRead } = useSocket();
  const { data: users = [] } = useUsers(!!user);
  const { data: messages = [] } = useMessages(userId);
  const sendMessage = useSendMessage(userId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const otherUser = users.find((u) => u._id === userId);

  useEffect(() => {
    markAsRead(userId);
  }, [userId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  if (!otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
        Usuário não encontrado
      </div>
    );
  }

  function handleSend(content: string) {
    sendMessage.mutate(content);
  }

  return (
    <>
      <ChatHeader
        user={otherUser}
        onBack={isMobile ? () => navigate({ to: '/chat' }) : undefined}
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-6">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.sender === user!._id}
            index={i}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </>
  );
}
