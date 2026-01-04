import { Request, Response, NextFunction } from "express";
import { IAdminMechanicManagementController } from "../../interfaces/IController/admin/IAdminMechanicManagementController";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK, INTERNAL_SERVER_ERROR } = STATUS_CODES;

class AdminMechanicManagementController
  implements IAdminMechanicManagementController
{
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async getMechList(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      console.log("Search from the frontend ", search);
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is", page);
      console.log("limit is", limit);
      const data = await this._adminService.getMechList({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("mechsData from the admin controller is ", data);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async blockMech(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechId } = req.params;
      const result = await this._adminService.blockMech({ mechId });
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

  async deleteMech(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechId } = req.params;
      const result = await this._adminService.deleteMech({ mechId });
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

  async getMechanicById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      console.log("id in the adminController is ", id);
      const result = await this._adminService.getMechanicById({ id });
      res.status(OK).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default AdminMechanicManagementController;
