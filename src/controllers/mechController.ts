import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
const { OK } = STATUS_CODES;
import { IMechController } from "../interfaces/IController/IMechController";

import {
  GetImageUrlResponse,
  GetPreSignedUrlResponse,
} from "../interfaces/dataContracts/Mech/IController.dto";
import { Iemail } from "../utils/email";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../awsConfig";
import { IMechServices } from "../interfaces/IServices/IMechServices";
import IReportService from "../interfaces/IServices/IReportService";

class mechController implements IMechController {
  constructor(
    private _mechServices: IMechServices,
    private _reportService: IReportService,
    private _email: Iemail
  ) {
    this._mechServices = _mechServices;
    this._reportService = _reportService;
    this._email = _email;
  }
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;
  async getAllMechanics(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the getAllService function in the admin controller");
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string;

      const data = await this._mechServices.getAllMechanics({
        page,
        limit,
        searchQuery,
      });
      console.log(
        "listed mechanic from the database is in the mechcontroller is ",
        data
      );
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllDevces  funciton in the mech controller to  access the all the devices "
      );
      const data = await this._mechServices.getDevcies();
      console.log(
        "listed services from the database is in the mech controller is",
        data
      );
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getS3SingUrlForMechCredinential(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetPreSignedUrlResponse | void> {
    try {
      const { fileName, fileType, name } = req.query as {
        fileName: string;
        fileType: string;
        name: string;
      };
      console.log("file from the front end is ", fileName, fileType);
      const result = await this._mechServices.getS3SingUrlForMechCredinential({
        fileName,
        fileType,
        name,
      });
      console.log("presinged Url is from teh adminController is ", result);
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

  //getImageUrl
  async getImageUrl(
    req: Request,
    res: Response,
    next: NextFunction
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



  //function  to create report from the mechside
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportData } = req.body;
      console.log(
        "Datas from the frontend  in the createReportFunciton in the mechController is ",
        reportData
      );
      const result = await this._reportService.createReport(reportData);
      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(
        "Error occured in the createReport function in the mechController",
        error
      );
      next(error);
    }
  }
}

export default mechController;
