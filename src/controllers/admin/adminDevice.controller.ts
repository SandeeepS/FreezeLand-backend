import { Request, Response, NextFunction } from "express";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { AddNewDeviceValidation } from "../../utils/validator";
import { IAdminDeviceController } from "../../interfaces/IController/admin/IAdminDeviceController";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK } = STATUS_CODES;

class AdminDeviceController implements IAdminDeviceController {
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async addNewDevice(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the backend for adding new Device in the admin Controller"
      );
      const { name } = req.body;

      console.log("name  from the frontend is ", name);
      const check = AddNewDeviceValidation(name);
      if (check) {
        //lets check the device  is allready present in the device  collection for avoiding duplication
        const isExist = await this._adminService.isDeviceExist(name);
        console.log("is devices exits or not ", isExist);
        if (!isExist) {
          const result = await this._adminService.addDevice({ name });
          if (result) {
            res.json({
              success: true,
              message: "added the service successfully",
            });
          } else {
            res.json({
              success: false,
              message: "Something went wrong while adding the service ",
            });
          }
        } else {
          console.log(
            "adding the new service is failed because service already exist"
          );
          res.json({
            success: false,
            message: "Service already existed",
          });
        }
      } else {
        res.json({
          success: false,
          message: "validation failed , please provide the correct data !!",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllDevces  funciton in the admin controller to  access the all the devices "
      );
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = ((req.query.search as string) || "").trim();
      const filter = (req.query.filter as string) || "all"; // for blocked/unblocked/all
      const data = await this._adminService.getDevcies({
        page,
        limit,
        filter,
        search,
      });
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

  async listUnlistDevices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the listUnlistDevice at adminController");
      const _id = req.params.deviceId;
      console.log("id reached from the front is ", _id);
      const result = await this._adminService.blockDevice({ _id });
      if (result) {
        res.json({ success: true, message: "blocked/unblocked the device " });
      } else {
        res.json({
          success: false,
          message: "Something went wrong please try again",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async deleteDevice(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in the admin controller for deleting the device ");
      console.log(req.params.deviceId);
      const { deviceId } = req.params;
      const result = await this._adminService.deleteDevice({ deviceId });
      if (result) res.json({ success: true, message: "Device deleted" });
      else
        res.json({
          success: false,
          message:
            "Something Went wrong while deleting the device please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }
}

export default AdminDeviceController;
