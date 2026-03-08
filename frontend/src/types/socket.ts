import type { Message } from ".";

export interface ServerToClientEvents {
  "message:new": (message: Message) => void;
  "user:online": (userId: string) => void;
  "user:offline": (userId: string) => void;
}

export interface ClientToServerEvents {}
