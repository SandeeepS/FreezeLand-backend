import express, { Express, Request, Response } from "express";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mechRoutes from "./routes/mechRoutes";
import logger from "./utils/logger";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();
const morganFormat = ":method :url :status :response-time ms";
const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mech", mechRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
