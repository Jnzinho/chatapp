import {
  createFileRoute,
  Outlet,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { UserListItem } from '#/components/chat/user-list-item';
import { useAuth } from '#/contexts/auth';
import { useSocket } from '#/contexts/socket';
import { useLogout } from '#/hooks/use-auth';
import { useIsMobile } from '#/hooks/use-mobile';
import { useUsers } from '#/hooks/use-users';
import { useMessages } from '#/hooks/use-messages';

export const Route = createFileRoute('/_authenticated/chat')({
  component: ChatLayout,
});

function ChatLayout() {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { data: users = [] } = useUsers(!!user);
  const params = useParams({ strict: false });
  const activeUserId = (params as { userId?: string }).userId;
  const isMobile = useIsMobile();

  if (!user) return null;

  const showSidebar = !isMobile || !activeUserId;
  const showContent = !isMobile || !!activeUserId;

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login', replace: true }),
    });
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center md:p-8">
      <div className="glass-panel animate-slide-up flex h-dvh w-full max-w-5xl overflow-hidden md:h-[88vh] md:rounded-3xl">
        {showSidebar && (
          <aside className="flex w-full flex-col border-r border-line md:w-[280px] md:shrink-0">
            <div className="flex items-center justify-between px-5 py-4 md:py-5">
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                Mensagens
              </h2>
              {isMobile && (
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full bg-received-bg ring-2 ring-glass-border"
                  />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg p-2 text-ink-muted transition-all hover:bg-sidebar-hover hover:text-ink"
                    title="Sair"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
              {users.map((u, i) => (
                <div
                  key={u._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60 + 100}ms` }}
                >
                  <SidebarItem
                    user={u}
                    currentUserId={user._id}
                    isActive={activeUserId === u._id}
                  />
                </div>
              ))}
            </div>
          </aside>
        )}

        {showContent && (
          <div className="flex flex-1 flex-col">
            {!isMobile && (
              <div className="flex items-center justify-end gap-3 border-b border-line px-6 py-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">{user.name}</p>
                  <p className="text-[11px] text-ink-muted">{user.email}</p>
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full bg-received-bg ring-2 ring-glass-border"
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer ml-1 rounded-lg p-2 text-ink-muted transition-all hover:bg-sidebar-hover hover:text-ink"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  user,
  currentUserId,
  isActive,
}: {
  user: import('#/types').User;
  currentUserId: string;
  isActive: boolean;
}) {
  const { unreadCounts } = useSocket();
  const { data: messages } = useMessages(user._id);
  const lastMsg = messages?.[messages.length - 1];

  let preview: string | undefined;
  if (lastMsg) {
    preview =
      lastMsg.sender === currentUserId
        ? `Você enviou: ${lastMsg.content}`
        : lastMsg.content;
  }

  return (
    <UserListItem
      user={user}
      lastMessage={preview}
      isActive={isActive}
      unreadCount={unreadCounts.get(user._id) ?? 0}
    />
  );
}
