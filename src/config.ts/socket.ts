// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger";

interface MessageData {
  room: string;
  message: string;
  sender: string;
  timestamp: Date;
}

export default function configureSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      logger.info(`User ${socket.id} joined room: ${roomId}`);
    });
    
    socket.on("send_message", (data: MessageData) => {
      io.to(data.room).emit("receive_message", data);
      logger.info(`Message sent in room ${data.room}`);
    });
    
    socket.on("typing", (data: {room: string, isTyping: boolean, user: string}) => {
      socket.to(data.room).emit("user_typing", {
        user: data.user,
        isTyping: data.isTyping
      });
    });
    
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}