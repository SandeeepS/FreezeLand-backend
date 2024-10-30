import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import AdminService from "../services/AdminServices";
import { LoginValidation } from "../utils/validator";
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR ,BAD_REQUEST } = STATUS_CODES;

class adminController {
  constructor(private adminService: AdminService) {}

  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("enterd in the backend adminlogin in adminController");
      const { email, password } = req.body;
      const check = LoginValidation(email, password);
      if (check) {
        const loginStatus = await this.adminService.adminLogin(email, password);

        if (!loginStatus.data.success) {
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: loginStatus.data.message });
          return;
        } else {
          const access_token = loginStatus.data.token;
          const refresh_token = loginStatus.data.refresh_token;
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
      } else {
        res
          .status(UNAUTHORIZED)
          .json({
            success: false,
            message: "Please check the email and password",
          });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getUserList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getUserList(
        page,
        limit,
        searchQuery
      );
      console.log("usersData from the admin controller is ", data);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getMechList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getMechList(
        page,
        limit,
        searchQuery
      );
      console.log("mechsData from the admin controller is ", data);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.blockUser(
        req.params.userId as string
      );
      if (result)
        res.json({ success: true, message: "block or unblocked the user" });
      else
        res.json({
          success: false,
          message: "Something Went wrong please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async blockMech(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.blockMech(
        req.params.mechId as string
      );
      if (result)
        res.json({ success: true, message: "block or unblocked the mechanic" });
      else
        res.json({
          success: false,
          message: "Something Went wrong please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.deleteUser(
        req.params.userId as string
      );
      if (result) res.json({ success: true, message: "deleted  the user" });
      else
        res.json({
          success: false,
          message: "Something Went wrong please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async deleteMech(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.adminService.deleteMech(
        req.params.mechId as string
      );
      if (result) res.json({ success: true, message: "deleted  the mechanic" });
      else
        res.json({
          success: false,
          message:
            "Something Went wrong while deleting the mechanic please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async addNewServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the backend for adding new Service in the admin Controller"
      );
      const { values } = req.body;
      console.log("values from the frontend is ", values);
      const result = await this.adminService.addService(values);
      if (result) {
        res.json({ success: true, message: "added the service successfully" });
      } else {
        res.json({
          success: false,
          message: "Something went wrong while adding the service ",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllServices funciton in the admin controller"
      );
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getServices(
        page,
        limit,
        searchQuery
      );
      console.log(
        "listed services from the database is in the admin controller is",
        data
      );
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllServices funciton in the admin controller"
      );
      const id = req.params.id;
      const result = await this.adminService.getService(id);
      res.status(OK).json(result);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }


  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in the admin controller for deleting the service ");
      console.log(req.params.serviceId)
      const result = await this.adminService.deleteService(
        req.params.serviceId as string
      );
      if (result) res.json({ success: true, message: "Service deleted" });
      else
        res.json({
          success: false,
          message:
            "Something Went wrong while deleting the service please try again",
        });
    } catch (error){
      console.log(error as Error);
      next(error);
    }
  }
 

  async editExistingService (req:Request,res:Response,next:NextFunction){
    try{
      const {_id,values} = req.body;
      console.log("the id from the fronedn is ",_id);
      const editedSevice = await this.adminService.editExistingService(_id,values);
      if(editedSevice){
        res
        .status(OK)
        .json({success:true,message:"Existing service  updated successfully"});
      }else{
        res.status(BAD_REQUEST).json({
          success:false,
          message:"service updation failed"
        })
      }

    }catch(error){
      console.log(error as Error);
      next(error);
    }
  }


  async adminLogout(req: Request, res: Response, next: NextFunction) {
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
