import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interfaces/IController/IAdminController";
import {
  GetImageUrlResponse,
  GetPreSignedUrlResponse,
} from "../interfaces/dataContracts/Admin/IController.dto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../awsConfig";
import IReportService from "../interfaces/IServices/IReportService";
import { IAdminService } from "../interfaces/IServices/IAdminService";

class adminController implements IAdminController {
  constructor(
    private _adminService: IAdminService,
    private _reportService: IReportService
  ) {
    this._adminService = _adminService;
    this._reportService = _reportService;
  }

  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  //changing getPresignedUrl functionality to _adminService ..........
  /************************ */

  async getPresignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetPreSignedUrlResponse | void> {
    try {
      const { fileName, fileType, folderName } = req.query as {
        fileName: string;
        fileType: string;
        folderName: string;
      };
      console.log("file from the front end is ", fileName, fileType);
      const result = await this._adminService.getPresignedUrl({
        fileName,
        fileType,
        folderName,
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

  async updateApprove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.id as string;
      const verificationStatus = req.query.verificationStatus as string;
      console.log(typeof verificationStatus);
      console.log(
        "id and verification status  from the front end in the adminController is ",
        id,
        verificationStatus
      );
      if (id && verificationStatus) {
        const result = await this._adminService.updateApprove({
          id,
          verificationStatus,
        });
        res.status(200).json({ success: true, result });
      } else {
        res.status(304).json({
          success: false,
          result: "Not modifeid , id or verificationStatus is undefined",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  //funciton to get all the complaints

  //funciton to get the complaint by id

  //get All reports raised by user reporter Role (user/mechanic )
  async getAllReportByReporterRole(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { reporterRole } = req.query;
      console.log("ReporterRole in the adminController", reporterRole);
      const result = await this._reportService.getAllReportByReporterRole(
        reporterRole as string
      );
      console.log("Reuslt after fetching the report data ,", result);
      if (result) {
        res.status(200).json({ message: "success", result });
      } else {
        res.status(200).json({ message: "failed" });
      }
    } catch (error) {
      console.log(
        "Error occured in the getAllReportByReporterRole in the adminController",
        error
      );
      next(error as Error);
    }
  }

  //function to update the report status in the admin side
  async updateReportStatus(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "Entered in the updateReportStatus function in the admin side "
      );
      const { reportId, status } = req.body;
      console.log("report id and status are ", reportId, status);
      const response = await this._reportService.updateReportStatus({
        reportId,
        status,
      });
      if (response) {
        res.status(200).json({
          success: true,
          message: "updated successfully",
          response,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "error occured while updaing the status",
        });
      }
      return response;
    } catch (error) {
      console.log("errro occured while updating the report status", error);
      next(error as Error);
    }
  }
}

export default adminController;
