import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		const storedId = localStorage.getItem("chat_auth_user_id")
		if (!storedId) {
			throw redirect({ to: "/login" })
		}
	},
	component: () => <Outlet />,
})
