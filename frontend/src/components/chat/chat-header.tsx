import { ArrowLeft } from 'lucide-react';
import type { User } from '#/types';

type Props = {
  user: User;
  onBack?: () => void;
};

export function ChatHeader({ user, onBack }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 md:px-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer -ml-1 rounded-lg p-1.5 text-ink-muted transition-all hover:bg-sidebar-hover hover:text-ink"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full bg-received-bg"
        />
        {user.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald" />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{user.name}</p>
        <p className="text-[11px] text-ink-muted">
          {user.online ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
}
