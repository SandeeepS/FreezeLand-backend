import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { CreateJWT } from "../utils/generateToken";
import AdminRepository from "../repositories/adminRepository";

const jwt = new CreateJWT();
const adminRepository = new AdminRepository();
dotenv.config();

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.admin_access_token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided" });

    const decoded = jwt.verifyToken(token);

    if (decoded) {
      const admin = await adminRepository.getAdminById({
        id: decoded.toString(),
      });
      console.log("admin is present ", admin);
      req.adminId = decoded.toString();
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }
  } catch (err) {
    console.log(err);
    console.log("error is in the catch block!");
    return res
      .status(401)
      .send({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export default adminAuth;
