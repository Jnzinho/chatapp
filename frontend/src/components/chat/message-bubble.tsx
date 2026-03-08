import type { Message } from '#/types';

type Props = {
  message: Message;
  isOwn: boolean;
  index: number;
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return `Hoje, ${date.getHours()}h${String(date.getMinutes()).padStart(
    2,
    '0',
  )}`;
}

export function MessageBubble({ message, isOwn, index }: Props) {
  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${
        isOwn ? 'animate-slide-right' : 'animate-slide-left'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="max-w-[85%] md:max-w-[70%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
            isOwn
              ? 'bg-linear-to-br from-amber to-amber-deep text-white shadow-sm'
              : 'bg-received-bg text-ink'
          }`}
        >
          {message.content}
        </div>
        <p
          className={`mt-1 text-[10px] text-ink-muted ${
            isOwn ? 'text-right' : 'text-left'
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
