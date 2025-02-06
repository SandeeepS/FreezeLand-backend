import { Request, Response, NextFunction } from "express";
import Iuser from "../interfaces/entityInterface/Iuser"; // Import Iuser

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as Iuser; // Explicitly cast req.user to Iuser

    if (user) {
      console.log("user is from the roleCheck.ts", user);
    }

    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};