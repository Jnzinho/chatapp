import type { Server, Socket } from "socket.io";
import { User } from "../../models/User";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types";

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export function registerPresenceHandlers(io: AppServer, socket: AppSocket) {
  const { userId } = socket.data;

  User.updateOne({ _id: userId }, { online: true }).catch(() => {});
  socket.broadcast.emit("user:online", userId);

  socket.on("disconnect", () => {
    const room = io.sockets.adapter.rooms.get(userId);
    if (room && room.size > 0) return;

    User.updateOne({ _id: userId }, { online: false }).catch(() => {});
    socket.broadcast.emit("user:offline", userId);
  });
}
