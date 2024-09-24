import { Request, Response } from "express";
import AdminService from "../services/AdminServices";
import { STATUS_CODES } from "../constants/httpStatusCodes";

const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class adminController {
  constructor(private adminService: AdminService) {}

  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async adminLogin(req: Request, res: Response) {
    try {
      console.log("enterd in the backend adminlogin in adminController");
      const { email, password } = req.body;
      const loginStatus = await this.adminService.adminLogin(email, password);
      if (
        loginStatus &&
        !loginStatus.data.success &&
        loginStatus.data.message === "Incorrect password!"
      ) {
        if (!loginStatus.data.success) {
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: loginStatus.data.message });
          return;
        }
        const time = this.milliseconds(23, 30, 0);
        const access_token = loginStatus.data.token;
        const refresh_token = loginStatus.data.refreshToken;
        const accessTokenMaxAge = 5 * 60 * 1000;
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
        console.log("respose is going to send");
        res
          .status(loginStatus.status)
          .cookie("admin_access_token", access_token, {
            maxAge: accessTokenMaxAge,
          })
          .cookie("refresh_token", refresh_token, {
            maxAge: refreshTokenMaxAge,
          })
          .json(loginStatus);
      }
    } catch (error) {
      console.log(error as Error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async adminLogout(req: Request, res: Response) {
    try {
      res.cookie("admin_access_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ success: true, message: "logout sucessfully" });
    } catch (error) {
      console.log(error as Error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default adminController;
