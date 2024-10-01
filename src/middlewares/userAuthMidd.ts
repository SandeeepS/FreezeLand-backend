import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { CreateJWT } from "../utils/generateToken";
import UserRepository from "../repositories/userRepository";
import { UserInterface } from "../models/userModel";


const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: UserInterface | null;
    }
  }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log("enterd in the userAuth")
    let token = req.cookies.access_token;
    let refresh_token = req.cookies.refresh_token;

    console.log("accesstoken  and refreshtoken is ",token , refresh_token)
  
    if (!refresh_token)
      return res.json({
        success: false,
        message: "Token expired or not available",
      });
  
    if (!token) {
      console.log("noooooooo");
      const newAccessToken = await refreshAccessToken(refresh_token);
      const accessTokenMaxAge = 15 * 60 * 1000;
      res.cookie("access_token", newAccessToken, { maxAge: accessTokenMaxAge });
    }
    const decoded = jwt.verifyToken(token);
    // console.log(decoded);
    if (decoded?.success) {
      let user = await userRepository.getUserById(
        decoded.decoded?.data?.toString()
      );
      if (user?.isBlocked) {
        return res.json({
          success: false,
          message: "User is blocked by admin!",
        });
      } else {
        req.userId = decoded.decoded?.data?.toString();
        req.user = user;
        next();
      }
    } else {
      return res.json({ success: false, message: decoded?.message });
    }
  } catch (err: any) {
    console.log("the error is here.");
    console.log(err);
    return res.send({ success: false, message: "Authentication failed!" });
  }
};
const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshToken) throw new Error("No refresh token found");

    const decoded = jwt.verifyRefreshToken(refreshToken);

    const newAccessToken = jwt.generateToken(decoded?.decoded.data);
    return newAccessToken;
  } catch (error) {
    console.log(error as Error);
    throw new Error("Invalid refresh token");
  }
};

export default userAuth;
