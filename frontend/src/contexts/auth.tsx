import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react"
import { USERS } from "#/data/fake"
import type { User } from "#/types"

type AuthContextType = {
	user: User | null
	login: (email: string, _password: string) => boolean
	register: (name: string, email: string, _password: string) => boolean
	logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = "chat_auth_user_id"

function getInitialUser(): User | null {
	const storedId = localStorage.getItem(STORAGE_KEY)
	if (!storedId) return null
	return USERS.find((u) => u.id === storedId) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(getInitialUser)

	const login = useCallback((email: string, _password: string): boolean => {
		const found = USERS.find((u) => u.email === email)
		if (!found) return false
		setUser(found)
		localStorage.setItem(STORAGE_KEY, found.id)
		return true
	}, [])

	const register = useCallback(
		(name: string, email: string, _password: string): boolean => {
			const exists = USERS.find((u) => u.email === email)
			if (exists) return false

			const newUser: User = {
				id: String(USERS.length + 1),
				name,
				email,
				avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`,
				online: true,
			}
			USERS.push(newUser)
			setUser(newUser)
			localStorage.setItem(STORAGE_KEY, newUser.id)
			return true
		},
		[],
	)

	const logout = useCallback(() => {
		setUser(null)
		localStorage.removeItem(STORAGE_KEY)
	}, [])

	return (
		<AuthContext value={{ user, login, register, logout }}>
			{children}
		</AuthContext>
	)
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used within AuthProvider")
	return ctx
}
