import { Request, Response, NextFunction } from "express";
import { IAdminAuthController } from "../../interfaces/IController/admin/IAdminAuthController";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK } = STATUS_CODES;

class AdminAuthController implements IAdminAuthController {
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async adminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("enterd in the backend adminlogin in adminAuthController");
      const { email, password } = req.body;

      const loginStatus = await this._adminService.adminLogin({
        email,
        password,
        role: "admin",
      });

      if (loginStatus.data.success === false) {
        res.status(OK).json({
          data: {
            success: false,
            message: loginStatus.data.message,
          },
        });
        return;
      } else {
        const access_token = loginStatus.data.token;
        const refresh_token = loginStatus.data.refresh_token;
        const accessTokenMaxAge = 5 * 60 * 1000; //15 min
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; //48 h
        console.log("respose is going to send to the frontend");
        res
          .status(loginStatus.status)
          .cookie("admin_access_token", access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("admin_refresh_token", refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json(loginStatus);
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

   //fucntion to logout
  async adminLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie("admin_access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("admin_refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      res.status(200).json({ success: true, message: "logout sucessfully" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }


}

export default AdminAuthController;
