import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../../awsConfig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
const { BAD_REQUEST , OK} = STATUS_CODES;
import {
  GetImageUrlResponse,
  GetPreSignedUrlResponse,
} from "../../interfaces/dataContracts/User/IController.dto";
import { IUserController } from "../../interfaces/IController/user/IController";
import { IUserServices } from "../../interfaces/IServices/IUserServices";
import { Iemail } from "../../utils/email";
import IReportService from "../../interfaces/IServices/IReportService";

class userController implements IUserController {
  constructor(
    private _userServices: IUserServices,
    private _reportService: IReportService,
    private _email: Iemail,
  ) {
    this._userServices = _userServices;
    this._reportService = _reportService;
    this._email = _email;
  }
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async createStripeSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { data } = req.body;
      console.log(
        "data reached in the usercontroller while creating stripe session ",
        data,
      );
      const session = await this._userServices.createStripeSession(data);
      console.log("--------------------------------------");
      console.log(
        "strip session from the createStripSession in the userController",
        session,
      );
      if (session) {
        res.status(OK).json({ success: true, session });
      } else {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Session creation failed",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }







  //function to update the userLocation after singup and again login
  async updateUserLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, locationData } = req.body;
      console.log(
        "Entered in the updateUserLocation in the userController is ",
        userId,
        locationData,
      );
      const response = await this._userServices.updateUserLocation({
        userId,
        locationData,
      });

      res.status(OK).json({ message: "Success", response });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }



  async getImageUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<GetImageUrlResponse | void> {
    try {
      const { imageKey } = req.query;
      console.log("imageKey from the frontend is ", imageKey);
      if (typeof imageKey !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid image key",
        }) as GetImageUrlResponse;
      }

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey,
      });
      const url = await getSignedUrl(S3Client, command, { expiresIn: 3600 });
      res.status(200).json({ success: true, url });
    } catch (error) {
      next(error);
    }
  }

  async getPresignedUrl(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<GetPreSignedUrlResponse | void> {
    try {
      const { fileName, fileType, folderName } = req.query as {
        fileName: string;
        fileType: string;
        folderName: string;
      };
      console.log("file from the front end is ", fileName, fileType);
      const result = await this._userServices.getPresignedUrl({
        fileName,
        fileType,
        folderName,
      });
      console.log("presinged Url is from teh userController is ", result);
      if (result.success === false) {
        return res.status(400).json({
          success: false,
          message: "File name and type are required",
        }) as GetPreSignedUrlResponse;
      } else {
        return res.status(200).json({
          success: true,
          uploadURL: result.uploadURL,
          imageName: result.imageName,
          key: result.key,
        }) as GetPreSignedUrlResponse;
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }



  //getting mechanic details  in the usercontroller.
  async getMechanicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "id reached in the userController for getting mech details",
        id,
      );
      if (typeof id === "string") {
        const result = await this._userServices.getMechanicDetails({ id });
        res.status(OK).json({ success: true, result: result });
      } else {
        console.log(
          "Id is undifined in the getMechanicDetails in userController",
        );
        res.status(STATUS_CODES.CONFLICT).json({ success: false });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //function to get the service details for user complaint reginstration
  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the getAllServices funciton in the user controller");
      const id = req.params.id;
      const result = await this._userServices.getService({ id });
      res.status(OK).json(result);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //function to get the success payment
  async successPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { sessionId } = req.query;
      console.log(
        "entered in the successPayment function in the userController",
      );
      console.log("sessionId from the frontend is ", sessionId);
      const result = await this._userServices.successPayment(
        sessionId as string,
      );
      console.log("result from the successPayment in the userController");
      res.status(OK).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }


  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportData } = req.body;
      console.log(
        "Datas from the frontend  in the createReportFunciton in the userController is ",
        reportData,
      );
      const result = await this._reportService.createReport(reportData);
      res.status(200).json({ success: true, result });
      return null;
    } catch (error) {
      console.log(
        "Error occured in the createReport function in the userController",
        error,
      );
      next(error);
    }
  }

 


}

export default userController;
