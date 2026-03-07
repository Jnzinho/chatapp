import type { Message, User } from '#/types';

export const USERS: User[] = [
  {
    id: '1',
    name: 'Fulano de Tal',
    email: 'fulanodetal@gmail.com',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Fulano',
    online: true,
  },
  {
    id: '2',
    name: 'Cláudia',
    email: 'claudia@gmail.com',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Claudia',
    online: true,
  },
  {
    id: '3',
    name: 'Brenda',
    email: 'brenda@gmail.com',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brenda',
    online: false,
  },
  {
    id: '4',
    name: 'Ricardo',
    email: 'ricardo@gmail.com',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Ricardo',
    online: true,
  },
  {
    id: '5',
    name: 'Marina',
    email: 'marina@gmail.com',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Marina',
    online: false,
  },
];

const today = new Date();

function time(hours: number, minutes: number): Date {
  const d = new Date(today);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: '2',
    receiverId: '1',
    content: 'Oi... Tudo bem?',
    timestamp: time(8, 30),
  },
  {
    id: 'm2',
    senderId: '1',
    receiverId: '2',
    content: 'Sim e você?',
    timestamp: time(8, 31),
  },
  {
    id: 'm3',
    senderId: '3',
    receiverId: '1',
    content: 'Eu não estou sabendo de nada. Deve ter algum problema.',
    timestamp: time(7, 45),
  },
  {
    id: 'm4',
    senderId: '1',
    receiverId: '3',
    content: 'Vou verificar e te aviso!',
    timestamp: time(7, 50),
  },
  {
    id: 'm5',
    senderId: '4',
    receiverId: '1',
    content: 'E aí, vamos jogar hoje?',
    timestamp: time(9, 0),
  },
  {
    id: 'm6',
    senderId: '1',
    receiverId: '4',
    content: 'Bora! Que horas?',
    timestamp: time(9, 5),
  },
  {
    id: 'm7',
    senderId: '5',
    receiverId: '1',
    content: 'Oi! Vi seu projeto, ficou muito bom!',
    timestamp: time(10, 15),
  },
];

export function getMessagesForConversation(
  currentUserId: string,
  otherUserId: string,
): Message[] {
  return MESSAGES.filter(
    (m) =>
      (m.senderId === currentUserId && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === currentUserId),
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function getLastMessageForUser(
  currentUserId: string,
  otherUserId: string,
): Message | undefined {
  const msgs = getMessagesForConversation(currentUserId, otherUserId);
  return msgs[msgs.length - 1];
}
