import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import type { RequestHandler } from "express";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types";
import { registerPresenceHandlers } from "./handlers/presence.handler";

type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

let io: AppServer;

export function initSocket(
  httpServer: HttpServer,
  sessionMiddleware: RequestHandler,
  corsOrigin: string,
): AppServer {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
    },
  });

  io.engine.use(sessionMiddleware);

  io.use((socket, next) => {
    const req = socket.request as any;
    const userId = req.session?.passport?.user;

    if (!userId) {
      return next(new Error("Não autenticado."));
    }

    socket.data.userId = String(userId);
    next();
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data;
    socket.join(userId);
    registerPresenceHandlers(io, socket);
  });

  return io;
}

export function getIO(): AppServer {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
