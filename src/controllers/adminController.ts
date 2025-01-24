import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import AdminService from "../services/AdminServices";
import S3Client from "../awsConfig";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AddNewServiceValidation,
  LoginValidation,
  AddNewDeviceValidation,
} from "../utils/validator";
// import { storage } from "../firebase";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";
const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = STATUS_CODES;

class adminController {
  constructor(private adminService: AdminService) {}

  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("enterd in the backend adminlogin in adminController");
      const { email, password } = req.body;
      const check = LoginValidation(email, password);
      if (check) {
        const loginStatus = await this.adminService.adminLogin({
          email,
          password,
        });

        if (!loginStatus.data.success) {
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: loginStatus.data.message });
          return;
        } else {
          const access_token = loginStatus.data.token;
          const refresh_token = loginStatus.data.refresh_token;
          const accessTokenMaxAge = 5 * 60 * 1000;
          const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
          console.log("respose is going to send to the frontend");
          res
            .status(loginStatus.status)
            .cookie("admin_access_token", access_token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("admin_refresh_token", refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(loginStatus);
        }
      } else {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please check the email and password",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getUserList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getUserList({
        page,
        limit,
        searchQuery,
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
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log("page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getMechList({
        page,
        limit,
        searchQuery,
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
      const result = await this.adminService.blockUser({
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
      const result = await this.adminService.blockMech({ mechId });
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
      const result = await this.adminService.deleteUser({ userId });
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
      const result = await this.adminService.deleteMech({ mechId });
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

  async getPresignedUrl(req: Request, res: Response, next: NextFunction) {
    try{
      const {fileName,fileType } = req.body;
      console.log("file from the front end is ",fileName,fileType);
      const imageName =  uuidv4() + "-" + fileName; ; // Generate a unique name for the image
      const bucketName = process.env.S3_BUCKET_NAME;
      const region = process.env.S3_REGION;

      if (!bucketName || !region) {
        throw new Error("AWS_S3_BUCKET_NAME or AWS_REGION is not defined in environment variables");
      }

      const s3Params = {
        Bucket: bucketName,
        Key: `ServiceImages/${imageName}`,
        ContentType: 'image/jpeg',
      };

      const command = new PutObjectCommand(s3Params);
      const uploadURL = await getSignedUrl(S3Client, command, { expiresIn: 60 });
      console.log("Presigned URL: ", uploadURL);

      // Send the presigned URL to the client
      return res.status(200).json({ success: true, uploadURL, imageName });


    }catch(error){
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

        //below code is used to upload to the s3 bucket 
        const imageName = `${uuidv4()}.jpg`; 
        const s3Params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `ServiceImages/${imageName}`,
          ContentType: 'image/jpeg',
        };

        const command = new PutObjectCommand(s3Params);
        const uploadURL = await getSignedUrl(S3Client, command, { expiresIn: 60 });
        console.log("Presigned URL: ", uploadURL);

        // Here you would send the presigned URL to the client and let the client upload the image
        // For this example, let's assume the client has uploaded the image and we have the image URL

        const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/ServiceImages/${imageName}`;
        values.image = imageUrl;
        console.log("image url is ssssss",values.image);
        //lets check the serviec is allready present in the service collection for avoiding duplication
        const isExist = await this.adminService.isServiceExist(values.name);
        if (!isExist) {
          const result = await this.adminService.addService({values});
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
        const isExist = await this.adminService.isDeviceExist(name);
        console.log("is devices exits or not ", isExist);
        if (!isExist) {
          const result = await this.adminService.addDevice(name);
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
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getServices({
        page,
        limit,
        searchQuery,
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
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this.adminService.getDevcies({
        page,
        limit,
        searchQuery,
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
      const result = await this.adminService.getService({ id });
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
      const result = await this.adminService.blockService({ _id });
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
      const result = await this.adminService.blockDevice({ _id });
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
      const result = await this.adminService.deleteService({ serviceId });
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
      const result = await this.adminService.deleteDevice({ deviceId });
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

      const check = AddNewServiceValidation(values.name, values.discription);
      if (check) {
        console.log("validation has no problem in the editExistingService");
        const isExist = await this.adminService.isServiceExist(values.name);

        if (!isExist) {
          const editedSevice = await this.adminService.editExistingService({
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
          res.status(BAD_REQUEST).json({
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

  async adminLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("admin_access_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ success: true, message: "logout sucessfully" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }
}

export default adminController;
