import { Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
dotenv.config();

interface VerifyResult {
  success: boolean;
  decoded?: JwtPayload;
  message: string;
}

export interface ICreateJWT {
  generateToken(payload: string, role: string): string;
  generateRefreshToken(payload: string): string;
  verifyToken(token: string): VerifyResult;
  verifyRefreshToken(token: string, res: Response): VerifyResult;
}

export class CreateJWT implements ICreateJWT {
  generateToken(payload: string, role: string): string {
    if (!payload) {
      throw new Error("Payload is required for token generation");
    }
    const token = jwt.sign(
      { data: payload, role: role },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: "1m",
      }
    );
    return token;
  }

  generateRefreshToken(payload: string): string {
    if (!payload) {
      throw new Error("Payload is required for refresh token generation");
    }
    return jwt.sign(
      { data: payload },
      process.env.JWT_REFRESH_SECRET as Secret,
      { expiresIn: "48h" }
    );
  }

  verifyToken(token: string): VerifyResult {
    try {
      const secret = process.env.JWT_SECRET as Secret;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { success: true, decoded, message: "verified" };
    } catch (error) {
      console.error("Error while verifying JWT token:", error);
      return { success: false, message: "Token Expired!" };
    }
  }
  verifyRefreshToken(token: string, res: Response): VerifyResult {
    try {
      const secret = process.env.JWT_REFRESH_SECRET as Secret;
      if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;
      console.log("decoded data from the jwt.varify fucniton ", decoded);
      return { success: true, decoded, message: "verified" };
    } catch (error) {
      console.error("Error while verifying refresh token:", error);
      if (error instanceof jwt.TokenExpiredError) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return { success: false, message: "Refresh Token Expired!" };
      }
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return { success: false, message: "Internal server error" };
    }
  }
}
