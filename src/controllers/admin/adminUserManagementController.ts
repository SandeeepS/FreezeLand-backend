import { Request, Response, NextFunction } from "express";
import { IAdminUserManagementController } from "../../interfaces/IController/admin/IAdminUserManagementController";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK,INTERNAL_SERVER_ERROR} = STATUS_CODES;

class AdminUserManagementController implements IAdminUserManagementController {
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async getUserList(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is ", page);
      console.log("limit is ", limit);
      console.log("Search is ", search);
      const data = await this._adminService.getUserList({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("usersData from the admin controller is ", data);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

    async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await this._adminService.blockUser({
        userId,
      });
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


    async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await this._adminService.deleteUser({ userId });
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

}

export default AdminUserManagementController;
