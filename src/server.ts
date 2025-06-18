import dotenv from "dotenv";
dotenv.config();


import express, { Express, Request, Response } from "express";
import http from "http";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mechRoutes from "./routes/mechRoutes";
import chatRouters from "./routes/chatRoutes";
import logger from "./utils/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import configureSocket from "./config.ts/socket";

const morganFormat = ":method :url :status :response-time ms";
const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;


const server = http.createServer(app);



app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [ "http://localhost:5173","https://freezeland.online/"];
      
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, origin); 
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ], 
    credentials: true,
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200 
  })
);




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

app.use(errorHandlerMiddleware);
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

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mech", mechRoutes);
app.use("/api/chat",chatRouters);

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
