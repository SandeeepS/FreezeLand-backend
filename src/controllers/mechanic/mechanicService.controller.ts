import { Request, Response, NextFunction } from "express";
import { IMechanicServiceController } from "../../interfaces/IController/mechanic/IMechanicServiceController";
import { IMechServices } from "../../interfaces/IServices/IMechServices";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK, NOT_FOUND } = STATUS_CODES;

class MechanicServiceController implements IMechanicServiceController {
  constructor(private _mechServices: IMechServices) {
    this._mechServices = _mechServices;
  }

  //function to get all userRegisterd complaints
  async getAllUserRegisteredServices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body;
      console.log(
        "userId in the mechController in the getAllUserRegisteredService"
      );
      const page = 1;
      const limit = 10;
      const searchQuery = "";
      const allRegisteredUserServices =
        await this._mechServices.getAllUserRegisteredServices(
          page,
          limit,
          searchQuery,
          id
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
        "error while getting the allregistered complaints from the database in the mechController",
        error as Error
      );
      next(error);
    }
  }

  //function to get the specified compliant  using compliant Id
  async getComplaintDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "Enterd in the getComplaintDetails function in the mechController with id",
        id
      );
      const result = await this._mechServices.getComplaintDetails(id as string);
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  //function to update the complaint database , while accepting the work by mechanic
  async updateWorkAssigned(req: Request, res: Response, next: NextFunction) {
    try {
      const { complaintId, mechanicId, status, roomId } = req.body;
      console.log(
        "Entered in the updateWorkAssigned function in mechController",
        complaintId,
        mechanicId,
        status,
        roomId
      );
      const result = await this._mechServices.updateWorkAssigned(
        complaintId,
        mechanicId,
        status,
        roomId
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

    //function to access all accepted complaints by the mechanic
  async getAllAcceptedServices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { mechanicId } = req.query;
      console.log(
        "mechanic id in the getAllAcceptedServices in the mechController is ",
        mechanicId
      );
      const result = await this._mechServices.getAllAcceptedServices(
        mechanicId as string
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

    //funciton to update the  complaint details
  async updateComplaintStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const complaintId = req.query.complaintId as string;
      const nextStatus = req.query.nextStatus as string;
      console.log(
        "next status in the updateComplaintStatus is ",
        complaintId,
        nextStatus
      );
      const result = await this._mechServices.updateComplaintStatus(
        complaintId,
        nextStatus
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  
  //function to update the workdetails to the concern database
  async updateWorkDetails(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the updateworkerDetails function in the mechController"
      );
      const { complaintId, workDetails } = req.body;
      console.log(
        `complaint id is - ${complaintId} and workdetails is - ${[
          ...workDetails,
        ]}`
      );
      const result = await this._mechServices.updateWorkDetails({
        complaintId,
        workDetails,
      });
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(
        "Error occured in the mechController while updating Wroker Details"
      );
      next(error);
    }
  }

  
  //function to get all completed service for the mech service histroy listing
  async getAllCompletedServices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("Entered in the getAllCompleted Services");
      const { mechanicId } = req.query;
      console.log("mechanic id is", mechanicId);
      const result = await this._mechServices.getAllCompletedServices(
        mechanicId as string
      );
      res.status(OK).json({ success: true, result });
    } catch (error) {
      console.log(
        "Error occured in the mechanic controller while getting the completed complaints by mechic ",
        error
      );
      next(error);
    }
  }
}

export default MechanicServiceController;
