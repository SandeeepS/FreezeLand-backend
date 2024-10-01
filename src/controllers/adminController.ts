import { Request, Response,NextFunction } from "express";
import AdminService from "../services/adminServices";
import { STATUS_CODES } from "../constants/httpStatusCodes";

const { OK, UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class adminController {
  constructor(private adminService: AdminService) {}

  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async adminLogin(req: Request, res: Response,next:NextFunction) {
    try {
      console.log("enterd in the backend adminlogin in adminController");
      const { email, password} = req.body;
      const loginStatus = await this.adminService.adminLogin(email, password);
 
        if (!loginStatus.data.success) {
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: loginStatus.data.message });
          return;
        }else{
          const time = this.milliseconds(23, 30, 0);
          const access_token = loginStatus.data.token;
          const refresh_token = loginStatus.data.refreshToken;
          const accessTokenMaxAge = 5 * 60 * 1000;
          const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
          console.log("respose is going to send to the frontend");
          res
            .status(loginStatus.status)
            .cookie("admin_access_token", access_token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("admin_refresh_token", refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(loginStatus);
        }
      
      
    } catch (error) {
      console.log(error as Error);
      next(error)

    }
  }

  async getUserList(req: Request, res: Response,next:NextFunction) {
    try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const searchQuery = req.query.searchQuery as string | undefined
        console.log("page is ",page);
        console.log("limit is ",limit);
        const data = await this.adminService.getUserList(page, limit, searchQuery);
        console.log("usersData from the admin controller is ",data);
        res.status(OK).json(data);
    } catch (error) {
        console.log(error as Error);
        next(error)
    }
}



async getMechList(req: Request, res: Response,next:NextFunction) {
  try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined
      console.log("page is ",page);
      console.log("limit is ",limit);
      const data = await this.adminService.getMechList(page, limit, searchQuery);
      console.log("mechsData from the admin controller is ",data);
      res.status(OK).json(data);
  } catch (error) {
      console.log(error as Error);
      next(error)
  }
}

  async adminLogout(req: Request, res: Response,next:NextFunction) {
    try {
      res.cookie("admin_access_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ success: true, message: "logout sucessfully" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }
}

export default adminController;
