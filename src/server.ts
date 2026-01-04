import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import http from "http";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import chatRouters from "./routes/chatRoutes";
import logger from "./utils/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import configureSocket from "./config.ts/socket";
import { corsOptions } from "./utils/corsOptions";
import mechanicRouter from "./routes/mechRoutes";
const morganFormat = ":method :url :status :response-time ms";
const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;
const server = http.createServer(app);
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const uri: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-app";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error(error);
  }
})();

// Initialize Socket.io
const io = configureSocket(server);

// Exporting io
export { io };

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mech", mechanicRouter);
app.use("/api/chat", chatRouters);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.use(errorHandlerMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
