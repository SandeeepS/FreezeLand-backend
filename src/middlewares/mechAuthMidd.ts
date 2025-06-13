import { Request, Response, NextFunction } from "express";
import { CreateJWT } from "../utils/generateToken";
import MechRepository from "../repositories/mechRepository";

const jwt = new CreateJWT();
const mechanicRepository = new MechRepository();

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      mechanicId?: string;
      mechanic?: any;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

const mechAuth = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try { 
      console.log("reached the mechAuth");

      const accessToken = req.cookies.mech_access_token;
      const refreshToken = req.cookies.mech_refresh_token;
      console.log("access token and refresh token are", accessToken, refreshToken);

      //  checking  the refresh token exists and is valid
      if (!refreshToken) {
        console.log("refresh token is not present");
        clearMechanicAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Please log in again.",
        });
      }

      // Verify refresh token validity upfront
      const refreshTokenVerification = jwt.verifyRefreshToken(refreshToken, res);
      if (!refreshTokenVerification.success){
        clearMechanicAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token. Please log in again.",
        });
      }

      let finalAccessToken = accessToken;
      let accessTokenDecoded = null;

      // verify existing access token
      if (accessToken) {
        const accessTokenVerification = jwt.verifyToken(accessToken);
        if (accessTokenVerification.success && accessTokenVerification.decoded) {
          accessTokenDecoded = accessTokenVerification.decoded;
        }
      }

      // If access token is invalid/expired, generate new one using refresh token
      if (!accessTokenDecoded) {
        console.log("Access token expired or invalid, generating a new one");
        
        if (!refreshTokenVerification.decoded) {
          clearMechanicAuthCookies(res);
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
          clearMechanicAuthCookies(res);
          return res.status(500).json({
            success: false,
            message: "Failed to generate access token. Please log in again.",
          });
        }

        // new access token cookie
        const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
        res.cookie("mech_access_token", finalAccessToken, {
          maxAge: accessTokenMaxAge,
          httpOnly: true,
            secure: true, 
            sameSite: "none",
        });

        // Verifyinmg  the newly generated access token
        const newTokenVerification = jwt.verifyToken(finalAccessToken);
        if (!newTokenVerification.success || !newTokenVerification.decoded) {
          clearMechanicAuthCookies(res);
          return res.status(500).json({
            success: false,
            message: "Failed to verify newly generated access token.",
          });
        }
        accessTokenDecoded = newTokenVerification.decoded;
      }

      if (!accessTokenDecoded) {
        clearMechanicAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Please log in again.",
        });
      }

      // Get mechanic from database
      const id = accessTokenDecoded.data.toString();
      console.log("id from the decoded", id);
      const mechanic = await mechanicRepository.getMechById({id});

      if (!mechanic) {
        clearMechanicAuthCookies(res);
        return res.status(401).json({
          success: false,
          message: "Mechanic not found. Please log in again.",
        });
      }

      // Check if mechanic is blocked (if applicable)
      if (mechanic.isBlocked) {
        clearMechanicAuthCookies(res);
        return res.status(403).json({
          success: false,
          message: "Mechanic account is blocked by admin!",
        });
      }

      

      // Check mechanic role authorization
      if (!allowedRoles.includes(mechanic.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions. Access denied.",
        });
      }



      // Attach mechanic data to request object
      req.mechanicId = id;
      req.mechanic = mechanic;
      next();

    } catch (err) {
      console.error("Mechanic authentication error:", err);
      clearMechanicAuthCookies(res);
      return res.status(500).json({
        success: false,
        message: "Authentication failed due to server error!",
      });
    }
  };
};

// Helper function to clear mechanic authentication cookies
const clearMechanicAuthCookies = (res: Response) => {
  res.clearCookie("mech_access_token");
  res.clearCookie("mech_refresh_token");
};



export default mechAuth;