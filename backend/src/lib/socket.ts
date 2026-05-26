import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketServer;

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ assignmentId }: { assignmentId: string }) => {
      socket.join(assignmentId);
    });

    socket.on(
      "server-emit",
      ({
        room,
        event,
        data,
      }: {
        room: string;
        event: string;
        data: object;
      }) => {
        io.to(room).emit(event, data);
      }
    );
  });

  return io;
}

export function getIO(): SocketServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
