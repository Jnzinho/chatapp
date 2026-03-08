import { Link } from '@tanstack/react-router';
import type { User } from '#/types';

type Props = {
  user: User;
  lastMessage?: string;
  isActive: boolean;
};

export function UserListItem({ user, lastMessage, isActive }: Props) {
  return (
    <Link
      to="/chat/$userId"
      params={{ userId: user._id }}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-all duration-200 ${
        isActive
          ? 'border border-sidebar-active-border bg-sidebar-active'
          : 'border border-transparent hover:bg-sidebar-hover'
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full bg-received-bg"
        />
        {user.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">
          {user.name}
        </p>
        {lastMessage && (
          <p className="truncate text-[11px] text-ink-muted">{lastMessage}</p>
        )}
      </div>
    </Link>
  );
}
