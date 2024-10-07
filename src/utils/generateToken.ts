import { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
dotenv.config();

export class CreateJWT {
  generateToken(payload: string | undefined): string | undefined {
    if (payload) {
      const token = jwt.sign(
        { data: payload },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "5m" }
      );
      return token;
    }
  }
  generateRefreshToken(payload: string | undefined): string | undefined {
    return jwt.sign(
      { data: payload },
      process.env.JWT_REFRESH_SECRET as Secret,
      { expiresIn: "48h" }
    );
  }
  verifyToken(token: string): JwtPayload | null {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { success: true, decoded };
    } catch (error) {
      console.error("Error while verifying JWT token:", error as Error);
      if (error === "TokenExpiredError")
        return { success: false, message: "Token Expired!" };
      else return { success: false, message: "Internal server error" };
    }
  }
  verifyRefreshToken(token: string) {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { success: true, decoded };
    } catch (error) {
      console.log(error as Error);
    }
  }
}
