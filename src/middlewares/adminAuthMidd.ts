import { Request, Response, NextFunction } from "express";
import { CreateJWT } from "../utils/generateToken";
import AdminRepository from "../repositories/adminRepository";

const jwt = new CreateJWT();
const adminRepository = new AdminRepository();

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

/* eslint-enable @typescript-eslint/no-namespace */

const adminAuth = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.admin_access_token;
      const refresh_token = req.cookies.admin_refresh_token;

      if (!refresh_token) {
        res.clearCookie("admin_access_token");
        res.clearCookie("admin_refresh_token");
        return res.status(401).json({
          success: false,
          message: "Token expired or not available. Please log in again.",
        });
      }

      let decoded = jwt.verifyToken(access_token);

      if (!access_token || !decoded.success) {
        console.log("Access token expired or invalid, generating a new one");
        const newAccessToken = await refreshAdminAccessToken(
          refresh_token,
          res
        );

        if (!newAccessToken) {
          return res.status(401).json({
            success: false,
            message: "Failed to refresh access token. Please log in again.",
          });
        }

        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        res.cookie("admin_access_token", newAccessToken, {
          maxAge: accessTokenMaxAge,
        });
        decoded = jwt.verifyToken(newAccessToken);
      }

      if (decoded.success && decoded.decoded) {
        const admin = await adminRepository.getAdminById({
          id: decoded.decoded.data.toString(),
        });

        if (!admin) {
          return res.status(404).json({
            success: false,
            message: "Admin not found",
          });
        }

        req.adminId = decoded.decoded.data.toString();

        // Check user role
        if (admin != null && !allowedRoles.includes(admin.role)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden",
          });
        }

        next();
      } else {
        return res.status(401).json({
          success: false,
          message: decoded.message,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        success: false,
        message: "Authentication failed!",
      });
    }
  };
};

const refreshAdminAccessToken = async (refreshToken: string, res: Response) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");

    const decoded = jwt.verifyRefreshToken(refreshToken, res);

    if (decoded.success && decoded.decoded) {
      const newAccessToken = jwt.generateAccessToken(
        decoded.decoded.data,
        decoded.decoded.role
      );
      return newAccessToken;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Invalid refresh token");
  }
};

export default adminAuth;
