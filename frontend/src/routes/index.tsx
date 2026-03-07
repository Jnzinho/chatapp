import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const storedId = localStorage.getItem("chat_auth_user_id")
		if (storedId) {
			throw redirect({ to: "/chat" })
		}
		throw redirect({ to: "/login" })
	},
})
