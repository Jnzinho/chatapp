import { createFileRoute, Outlet, useParams } from "@tanstack/react-router"
import { LogOut } from "lucide-react"
import { UserListItem } from "#/components/chat/user-list-item"
import { useAuth } from "#/contexts/auth"
import { USERS, getLastMessageForUser } from "#/data/fake"

export const Route = createFileRoute("/_authenticated/chat")({
	component: ChatLayout,
})

function ChatLayout() {
	const { user, logout } = useAuth()
	const params = useParams({ strict: false })
	const activeUserId = (params as { userId?: string }).userId

	if (!user) return null

	const otherUsers = USERS.filter((u) => u.id !== user.id)

	return (
		<div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8">
			<div className="glass-panel animate-slide-up flex h-[88vh] w-full max-w-5xl overflow-hidden rounded-3xl">
				{/* Sidebar */}
				<aside className="flex w-[280px] shrink-0 flex-col border-r border-[var(--line)]">
					<div className="px-5 py-5">
						<h2 className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
							Mensagens
						</h2>
					</div>

					<div className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
						{otherUsers.map((u, i) => {
							const last = getLastMessageForUser(user.id, u.id)
							const preview = last
								? last.senderId === user.id
									? `Você enviou: ${last.content}`
									: last.content
								: undefined

							return (
								<div
									key={u.id}
									className="animate-fade-in"
									style={{ animationDelay: `${i * 60 + 100}ms` }}
								>
									<UserListItem
										user={u}
										lastMessage={preview}
										isActive={activeUserId === u.id}
									/>
								</div>
							)
						})}
					</div>
				</aside>

				{/* Main area */}
				<div className="flex flex-1 flex-col">
					{/* Top bar */}
					<div className="flex items-center justify-end gap-3 border-b border-[var(--line)] px-6 py-3">
						<div className="text-right">
							<p className="text-sm font-semibold text-[var(--ink)]">
								{user.name}
							</p>
							<p className="text-[11px] text-[var(--ink-muted)]">
								{user.email}
							</p>
						</div>
						<img
							src={user.avatar}
							alt={user.name}
							className="h-9 w-9 rounded-full bg-[var(--received-bg)] ring-2 ring-[var(--glass-border)]"
						/>
						<button
							type="button"
							onClick={logout}
							className="ml-1 rounded-lg p-2 text-[var(--ink-muted)] transition-all hover:bg-[var(--sidebar-hover)] hover:text-[var(--ink)]"
							title="Sair"
						>
							<LogOut size={16} />
						</button>
					</div>

					{/* Chat content */}
					<div className="flex flex-1 flex-col overflow-hidden">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}
