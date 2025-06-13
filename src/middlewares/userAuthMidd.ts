import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { CreateJWT } from "../utils/generateToken";
import UserRepository from "../repositories/userRepository";

const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config();

const userAuth = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("entered in the userAuth");
      const accessToken = req.cookies.user_access_token;
      const refreshToken = req.cookies.user_refresh_token;

      //  checking  refresh token exists and is valid
      if (!refreshToken) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Please log in again.",
        });
      }

      // Verify refresh token validity
      const refreshTokenVerification = jwt.verifyRefreshToken(
        refreshToken,
        res
      );
      if (!refreshTokenVerification.success) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token. Please log in again.",
        });
      }

      let finalAccessToken = accessToken;
      let accessTokenDecoded = null;

      // Try to verify existing access token
      if (accessToken) {
        const accessTokenVerification = jwt.verifyToken(accessToken);
        if (
          accessTokenVerification.success &&
          accessTokenVerification.decoded
        ) {
          accessTokenDecoded = accessTokenVerification.decoded;
        }
      }
      // If access token is invalid/expired, generate new one using refresh token
      if (!accessTokenDecoded) {
        console.log("Access token expired or invalid, generating a new one");

        if (!refreshTokenVerification.decoded) {
          clearAuthCookies(res);
          return res.status(401).json({
            success: false,
            message: "Invalid refresh token data. Please log in again.",
          });
        }

        // Generate new access token
        finalAccessToken = jwt.generateAccessToken(
          refreshTokenVerification.decoded.data,
          refreshTokenVerification.decoded.role
        );

        if (!finalAccessToken) {
          clearAuthCookies(res);
          return res.status(500).json({
            success: false,
            message: "Failed to generate access token. Please log in again.",
          });
        }

        // Set new access token cookie
        const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
        res.cookie("user_access_token", finalAccessToken, {
          maxAge: accessTokenMaxAge,
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        // Verifying  the newly generated access token
        const newTokenVerification = jwt.verifyToken(finalAccessToken);
        if (!newTokenVerification.success || !newTokenVerification.decoded) {
          clearAuthCookies(res);
          return res.status(500).json({
            success: false,
            message: "Failed to verify newly generated access token.",
          });
        }
        accessTokenDecoded = newTokenVerification.decoded;
      }

      if (!accessTokenDecoded) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Please log in again.",
        });
      }

      const user = await userRepository.getUserById({
        id: accessTokenDecoded.data,
      });

      if (!user) {
        clearAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "User not found. Please log in again.",
        });
      }

      if (user.isBlocked) {
        clearAuthCookies(res);
        return res.status(403).json({
          success: false,
          message: "User is blocked by admin!",
        });
      }

      // Check user role authorization
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions. Access denied.",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.log("Authentication error:", err);
      clearAuthCookies(res);
      return res.status(500).json({
        success: false,
        message: "Authentication failed due to server error!",
      });
    }
  };
};

// Helper function to clear authentication cookies
const clearAuthCookies = (res: Response) => {
  res.clearCookie("user_access_token");
  res.clearCookie("user_refresh_token");
};

export default userAuth;
