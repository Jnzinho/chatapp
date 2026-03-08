export interface ServerToClientEvents {
  "message:new": (message: Record<string, unknown>) => void;
  "user:online": (userId: string) => void;
  "user:offline": (userId: string) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {
  userId: string;
}
