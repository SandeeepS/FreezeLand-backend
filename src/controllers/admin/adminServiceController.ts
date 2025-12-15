import { Request, Response, NextFunction } from "express";
import { IAdminServiceController } from "../../interfaces/IController/admin/IAdminServiceController";
import { IAdminService } from "../../interfaces/IServices/IAdminService";
import { AddNewServiceValidation } from "../../utils/validator";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK,BAD_REQUEST } = STATUS_CODES;

class AdminServiceController implements IAdminServiceController {
  constructor(private _adminService: IAdminService) {
    this._adminService = _adminService;
  }

  async addNewServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the backend for adding new Service in the admin Controller"
      );
      const { values } = req.body;
      console.log("values from the frontend is ", values);

      const check = AddNewServiceValidation(values.name, values.discription);
      if (check) {
        const isExist = await this._adminService.isServiceExist(values.name);
        if (!isExist) {
          const result = await this._adminService.addService({ values });
          if (result) {
            res.json({
              success: true,
              message: "added the service successfully",
            });
          } else {
            res.json({
              success: false,
              message: "Something went wrong while adding the service",
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
      console.log(
        "error occured while adding new service in the  adminController.ts"
      );
      console.log(error as Error);
      next(error);
    }
  }

    async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllServices funciton in the admin controller"
      );

      const search = req.query.search as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this._adminService.getServices({
        page,
        limit,
        searchQuery,
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

   async getService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllServices funciton in the admin controller"
      );
      const id = req.params.id;
      const result = await this._adminService.getService({ id });
      res.status(OK).json(result);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

   async listUnlistServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the listUnlistServices at adminController");
      const _id = req.params.serviceId;
      console.log("id reached from the front is ", _id);
      const result = await this._adminService.blockService({ _id });
      if (result) {
        res.json({ success: true, message: "blocked/unblocked the service " });
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

    async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in the admin controller for deleting the service ");
      console.log(req.params.serviceId);
      const { serviceId } = req.params;
      const result = await this._adminService.deleteService({ serviceId });
      if (result) res.json({ success: true, message: "Service deleted" });
      else
        res.json({
          success: false,
          message:
            "Something Went wrong while deleting the service please try again",
        });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

    async editExistingService(req: Request, res: Response, next: NextFunction) {
      try {
        const { _id, values } = req.body;
        console.log("the id from the fronedn is ", _id);
        console.log("vales from the frontend in the admin Controller", values);
        const check = AddNewServiceValidation(values.name, values.discription);
        if (check) {
          console.log("validation has no problem in the editExistingService");
          const isExist = await this._adminService.isServiceExist(values.name);
  
          if (isExist == null) {
            const editedSevice = await this._adminService.editExistingService({
              _id,
              values,
            });
            if (editedSevice) {
              res.status(OK).json({
                success: true,
                message: "Existing service  updated successfully",
              });
            } else {
              res.status(BAD_REQUEST).json({
                success: false,
                message: "service updation failed",
              });
            }
          } else {
            console.log(
              "the service which you are trying to edit is already exist in the data base "
            );
            res.status(OK).json({
              success: false,
              message: "Editing service already exist in the database ",
            });
          }
        } else {
          console.log(
            "validation failed from the editExistService in the admincontroller"
          );
          res.status(BAD_REQUEST).json({
            success: false,
            message: "validation failed ",
          });
        }
      } catch (error) {
        console.log(error as Error);
        next(error);
      }
    }

}

export default AdminServiceController;
