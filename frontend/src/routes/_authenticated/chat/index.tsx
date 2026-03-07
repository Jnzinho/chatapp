import { createFileRoute } from "@tanstack/react-router"
import { MessageCircle } from "lucide-react"

export const Route = createFileRoute("/_authenticated/chat/")({
	component: ChatIndex,
})

function ChatIndex() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-3">
			<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--amber-soft)]">
				<MessageCircle
					size={28}
					strokeWidth={1.5}
					className="text-[var(--amber)]"
				/>
			</div>
			<p className="text-sm text-[var(--ink-muted)]">
				Selecione uma conversa para começar
			</p>
		</div>
	)
}
