import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { CreateJWT } from "../utils/generateToken";
import UserRepository from "../repositories/userRepository";
import { UserInterface } from "../interfaces/Model/IUser";
const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config();

const userAuth = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("entered in the userAuth");
      const token = req.cookies.user_access_token;
      const refresh_token = req.cookies.user_refresh_token;
      console.log("access token and refresh token are", token, refresh_token);

      if (!refresh_token) {
        res.clearCookie('user_access_token');
        res.clearCookie('user_refresh_token');
        return res.status(401).json({
          success: false,
          message: "Token expired or not available. Please log in again.",
        });
      }

      let decoded = jwt.verifyToken(token);

      if (!token || !decoded.success) {
        console.log("Access token expired or invalid, generating a new one");
        const newAccessToken = await refreshAccessToken(refresh_token, res);
        if (!newAccessToken) {
          return res.status(401).json({
            success: false,
            message: "Failed to refresh access token. Please log in again.",
          });
        }
        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        res.cookie("user_access_token", newAccessToken, { maxAge: accessTokenMaxAge });
        decoded = jwt.verifyToken(newAccessToken);
      }

      if (decoded.success && decoded.decoded) {
        const user = await userRepository.getUserById(decoded.decoded.data.toString());
        if (user?.isBlocked) {
          return res.status(403).json({
            success: false,
            message: "User is blocked by admin!",
          });
        }
        req.user = user || undefined;

        // Check user role
        if (user != null && !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        next();
      } else {
        return res.status(401).json({ success: false, message: decoded.message });
      }
    } catch (err) {
      console.log("the error is here.");
      console.log(err);
      return res.status(500).send({ success: false, message: "Authentication failed!" });
    }
  };
};

const refreshAccessToken = async (refreshToken: string, res: Response) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");

    const decoded = jwt.verifyRefreshToken(refreshToken, res);
    if (decoded.success && decoded.decoded) {
      const newAccessToken = jwt.generateToken(decoded.decoded.data, decoded.decoded.role);
      return newAccessToken;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error as Error);
    throw new Error("Invalid refresh token");
  }
};

export default userAuth;