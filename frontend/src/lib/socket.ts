import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "#/types/socket";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function createSocket(): AppSocket {
  return io(BASE_URL, {
    withCredentials: true,
    autoConnect: false,
  });
}
