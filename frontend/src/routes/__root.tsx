import { Outlet, createRootRoute } from "@tanstack/react-router"
import { AuthProvider } from "#/contexts/auth"

import "../styles.css"

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	return (
		<AuthProvider>
			<Outlet />
		</AuthProvider>
	)
}
