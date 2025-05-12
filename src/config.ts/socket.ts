// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger";
import ChatServices from "../services/chatServices";
import ChatRepository from "../repositories/chatRepository";
import ChatController from "../controllers/chatController";
import ConcernRepository from "../repositories/concernRepository";

interface MessageData {
  roomId: string;
  message: string;
  senderId: string;
  sendAt: Date;
  senderType: string;
}

export default function configureSocket(httpServer: HttpServer): Server {
  const chatRepository = new ChatRepository();
  const concernRepository = new ConcernRepository();
  const chatService = new ChatServices(chatRepository, concernRepository);
  const chatController = new ChatController(chatService);

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      logger.info(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("get_messages", async ({ roomId }) => {
      try {
        logger.info(`Fetching messages for room: ${roomId}`);
        const messages = await chatService.getMessagesByRoomId(roomId);
        // logger.info(`Found ${messages?.length} messages for room ${roomId}`);

        socket.emit("previous_messages", { messages });
      } catch (error) {
        logger.error(`Error fetching messages: ${error}`);
        socket.emit("previous_messages", { messages: [] });
      }
    });

    socket.on("send_message", async (data: MessageData) => {
      console.log("data in the socketio", data);
      const controllerData = {
        roomId: data.roomId,
        message: data.message,
        senderId: data.senderId,
        sendAt: data.sendAt,
        senderType: data.senderType,
      };
      try {
        await chatController.saveMessage(controllerData);
        io.to(data.roomId).emit("receive_message", data);
        console.log("message from the frontend is", data);
        logger.info(`Message sent in room ${data.roomId}`);
      } catch (error) {
        logger.error(`Failed to save message: ${error}`);
        throw error;
      }
    });

    socket.on(
      "typing",
      (data: { room: string; isTyping: boolean; user: string }) => {
        socket.to(data.room).emit("user_typing", {
          user: data.user,
          isTyping: data.isTyping,
        });
      }
    );

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}
