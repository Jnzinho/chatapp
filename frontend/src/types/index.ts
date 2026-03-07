export type User = {
	id: string
	name: string
	email: string
	avatar: string
	online: boolean
}

export type Message = {
	id: string
	senderId: string
	receiverId: string
	content: string
	timestamp: Date
}

export type Conversation = {
	userId: string
	lastMessage: string
	lastMessageTime: Date
}
