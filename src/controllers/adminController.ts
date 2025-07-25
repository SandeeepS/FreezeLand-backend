import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import {
  AddNewServiceValidation,
  AddNewDeviceValidation,
} from "../utils/validator";
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
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = STATUS_CODES;

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

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("enterd in the backend adminlogin in adminController");
      const { email, password } = req.body;

      const loginStatus = await this._adminService.adminLogin({
        email,
        password,
        role: "admin",
      });

      if (loginStatus.data.success === false) {
        res.status(OK).json({
          data: {
            success: false,
            message: loginStatus.data.message,
          },
        });
        return;
      } else {
        const access_token = loginStatus.data.token;
        const refresh_token = loginStatus.data.refresh_token;
        const accessTokenMaxAge = 5 * 60 * 1000; //15 min
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; //48 h
        console.log("respose is going to send to the frontend");
        res
          .status(loginStatus.status)
          .cookie("admin_access_token", access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("admin_refresh_token", refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json(loginStatus);
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
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

  async addNewServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the backend for adding new Service in the admin Controller"
      );
      const { values } = req.body;
      console.log("values from the frontend is ", values);

      const check = AddNewServiceValidation(values.name, values.discription);
      if (check) {
        //comented code is used to upoload to firebase
        // const storageRef = ref(storage, `ServiceImages/${values.name}`); // imageName can be any unique identifier
        // // Assume `base64String` is your Base64 image string, e.g., "data:image/jpeg;base64,..."
        // await uploadString(storageRef, values.image, "data_url");
        // const downloadURL = await getDownloadURL(storageRef);
        // console.log("the url from the firebase is ", downloadURL);
        // values.image = downloadURL;

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

  //adding new device

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

  async getAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "reached the getAllDevces  funciton in the admin controller to  access the all the devices "
      );
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this._adminService.getDevcies({
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

  //funciton to get the complaint by id
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
      if (result != null){
        res.status(OK).json({ message: "success", result });
      } else {
        res.status(OK).json({ message: "failed to cancel complaitn" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

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
  async updateReportStatus (req:Request,res:Response,next:NextFunction) {
    try{
      console.log("Entered in the updateReportStatus function in the admin side ");
      const {reportId,status} = req.body;
      console.log("report id and status are ",reportId,status);
      const response = await this._reportService.updateReportStatus({reportId,status});
      if(response){
        res.status(200).json({
          success:true,
          message:"updated successfully",
          response
        })
      }else{
        res.status(200).json({
          success:false,
          message:"error occured while updaing the status"
        })
      }
      return response;
    }catch(error){
      console.log("errro occured while updating the report status",error);
      next(error as Error);
    }
  }

  //fucntion to logout
  async adminLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .clearCookie("admin_access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("admin_refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      res.status(200).json({ success: true, message: "logout sucessfully" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }
}

export default adminController;
