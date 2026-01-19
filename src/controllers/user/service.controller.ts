import { Request, Response, NextFunction } from "express";
import { IServiceController } from "../../interfaces/IController/user/IServiceController";
import { IUserServices } from "../../interfaces/IServices/IUserServices";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { BAD_REQUEST, OK, NOT_FOUND } = STATUS_CODES;

class ServiceController implements IServiceController {
  constructor(private _userServices: IUserServices) {
    this._userServices = _userServices;
  }

  //function to register the service
  async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the register service in the backend userController",
      );
      const { data } = req.body;
      console.log("data from the frontend is ", data);
      const result = await this._userServices.registerService(data);
      if (result) {
        res.status(OK).json({
          success: true,
          message: "Service  registered successfully",
        });
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Complaint registration failed" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //getting all service which is provided by the website.
  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the getAllServices funciton in the user controller");
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this._userServices.getServices({
        page,
        limit,
        searchQuery,
        search,
      });

      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //getting all the registered complaints from the user
  async getAllUserRegisteredServices(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId } = req.query;
      console.log(
        "userId in the userController in the getAllUserRegisteredService",
        userId,
      );

      const page = 1;
      const limit = 25;
      const searchQuery = "";
      const allRegisteredUserServices =
        await this._userServices.getAllUserRegisteredServices(
          page,
          limit,
          searchQuery,
          userId as string,
        );
      if (allRegisteredUserServices) {
        res.status(OK).json({
          success: true,
          message: "data fetched successfully",
          allRegisteredUserServices: allRegisteredUserServices,
        });
      } else {
        res.status(NOT_FOUND).json({
          success: true,
          message: "Not Found",
        });
      }
    } catch (error) {
      console.log(
        "error while getting the allregistered complaints from the database in the userController",
        error as Error,
      );
      next(error);
    }
  }

  //function to get the specified userComplaint using user Id
  async getUserRegisteredServiceDetailsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.query;
      console.log(
        "Enterd in the getUserRegisteredServiceDetailsById function in the userController with id",
        id,
      );

      const result =
        await this._userServices.getUserRegisteredServiceDetailsById(
          id as string,
        );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }
}

export default ServiceController;
