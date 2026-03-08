import { createFileRoute, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { UserListItem } from "#/components/chat/user-list-item";
import { useAuth } from "#/contexts/auth";
import { useLogout } from "#/hooks/use-auth";
import { useUsers } from "#/hooks/use-users";
import { useMessages } from "#/hooks/use-messages";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatLayout,
});

function ChatLayout() {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { data: users = [] } = useUsers(!!user);
  const params = useParams({ strict: false });
  const activeUserId = (params as { userId?: string }).userId;

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="glass-panel animate-slide-up flex h-[88vh] w-full max-w-5xl overflow-hidden rounded-3xl">
        <aside className="flex w-[280px] shrink-0 flex-col border-r border-line">
          <div className="px-5 py-5">
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
              Mensagens
            </h2>
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

        <div className="flex flex-1 flex-col">
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
              onClick={() =>
                logoutMutation.mutate(undefined, {
                  onSuccess: () => {
                    navigate({ to: "/login", replace: true });
                  },
                })
              }
              className="ml-1 rounded-lg p-2 text-ink-muted transition-all hover:bg-sidebar-hover hover:text-ink"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  user,
  currentUserId,
  isActive,
}: {
  user: import("#/types").User;
  currentUserId: string;
  isActive: boolean;
}) {
  const { data: messages } = useMessages(user._id);
  const lastMsg = messages?.[messages.length - 1];

  let preview: string | undefined;
  if (lastMsg) {
    preview =
      lastMsg.sender === currentUserId
        ? `Você enviou: ${lastMsg.content}`
        : lastMsg.content;
  }

  return <UserListItem user={user} lastMessage={preview} isActive={isActive} />;
}
