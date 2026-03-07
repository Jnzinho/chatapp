import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ChatHeader } from '#/components/chat/chat-header';
import { MessageBubble } from '#/components/chat/message-bubble';
import { MessageInput } from '#/components/chat/message-input';
import { useAuth } from '#/contexts/auth';
import { MESSAGES, USERS, getMessagesForConversation } from '#/data/fake';
import type { Message } from '#/types';

export const Route = createFileRoute('/_authenticated/chat/$userId')({
  component: ChatRoom,
});

function ChatRoom() {
  const { userId } = Route.useParams();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = USERS.find((u) => u.id === userId);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) return;
    setMessages(getMessagesForConversation(user.id, userId));
  }, [user, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user || !otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--ink-muted)]">
        Usuário não encontrado
      </div>
    );
  }

  function handleSend(content: string) {
    if (!user) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      receiverId: userId,
      content,
      timestamp: new Date(),
    };
    MESSAGES.push(newMsg);
    setMessages((prev) => [...prev, newMsg]);
  }

  return (
    <>
      <ChatHeader user={otherUser} />
      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === user.id}
            index={i}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </>
  );
}
