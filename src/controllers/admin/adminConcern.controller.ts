import { Request, Response, NextFunction } from "express";
import { IAdminConcernController } from "../../interfaces/IController/admin/IAdminConcernController";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK } = STATUS_CODES;

class AdminConcernController implements IAdminConcernController {
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async getAllComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllComplaints funciton in the admin controller"
      );
      const search = req.query.search as string;
      console.log("Search from the frontend in adminController ", search);
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this._adminService.getAllComplaints(
        page,
        limit,
        searchQuery,
        search
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

  async getComplaintById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getComplaintById funciton in the admin controller"
      );
      const id = req.params.id;
      const result = await this._adminService.getComplaintById(id);
      res.status(OK).json(result);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //function to cancel the complaint
  async cancelComplaint(req: Request, res: Response, next: NextFunction) {
    try {
      const { complaintId, userRole, reason } = req.body;
      console.log(
        "entered in the cancelcomplaint in the admin controller",
        complaintId,
        userRole,
        reason
      );
      const result = await this._adminService.cancelComplaint(
        complaintId,
        userRole,
        reason
      );
      if (result != null) {
        res.status(OK).json({ message: "success", result });
      } else {
        res.status(OK).json({ message: "failed to cancel complaitn" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }
}

export default AdminConcernController;
