import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../awsConfig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
const { BAD_REQUEST, OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
import { AddressValidation } from "../utils/validator";
import { EditUserDetailsValidator } from "../utils/validator";
import {
  IEditUser,
  GetImageUrlResponse,
  GetPreSignedUrlResponse,
} from "../interfaces/dataContracts/User/IController.dto";
import { IUserController } from "../interfaces/IController/IUserController";
import { IUserServices } from "../interfaces/IServices/IUserServices";
import { Iemail } from "../utils/email";
import IReportService from "../interfaces/IServices/IReportService";

class userController implements IUserController {
  constructor(
    private _userServices: IUserServices,
    private _reportService: IReportService,
    private _email: Iemail
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
    next: NextFunction
  ): Promise<void> {
    try {
      const { data } = req.body;
      console.log(
        "data reached in the usercontroller while creating stripe session ",
        data
      );
      const session = await this._userServices.createStripeSession(data);
      console.log("--------------------------------------");
      console.log(
        "strip session from the createStripSession in the userController",
        session
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



  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (userId) {
        console.log("userId from the getProfile in the useController", userId);
        const currentUser = await this._userServices.getProfile({
          id: userId as string,
        });
        if (!currentUser)
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: "Authentication failed..!" });
        else if (currentUser?.data.data?.isBlocked)
          res.status(UNAUTHORIZED).json({
            success: false,
            message: "user has been blocked by the admin!",
          });
        else res.status(OK).json(currentUser);
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req bidt kdjfsfdsffh", req.body);
      const { _id, name, phone, profile_picture }: IEditUser = req.body;
      const check = EditUserDetailsValidator(name, phone);
      if (check) {
        const editedUser = await this._userServices.editUser({
          _id,
          name,
          phone,
          profile_picture,
        });
        console.log("fghfgdfggdgnfgngnngjdfgnkj", editedUser);
        if (editedUser) {
          res
            .status(OK)
            .json({ success: true, message: "UserData updated sucessfully" });
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: "UserData updation is not updated !!",
          });
        }
      } else {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please check the name and phone number  !!",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //this same funciton is also used for editing the existing user Address ,if the _id is present it is used to updated the existing address
  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "enterd in the addAddress fucniton in the backend userController"
      );
      const { newAddress } = req.body;
      console.log("new Address in the controller is ",newAddress)
      const check = AddressValidation(
        newAddress.userId,
        newAddress.addressType,
        newAddress.fullAddress,
        newAddress.houseNumber,
        newAddress.longitude,
        newAddress.latitude,
        newAddress.landmark
      );
      if (check) {
        const addedAddress = await this._userServices.AddUserAddress({
          values: newAddress,
        });
        if (addedAddress) {
          res.status(OK).json({
            success: true,
            message: "User address added successfully",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "User Address addingh failed" });
        }
      } else {
        console.log(
          "address validation failed form the addAddress in the userController"
        );
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Address validation failed " });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async editAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in teh userController for editing the address");
      const { values, _id, addressId } = req.body;
      const check = AddressValidation(
        values.name,
        values.phone,
        values.email,
        values.state,
        values.pin,
        values.district,
        values.landMark
      );
      if (check) {
        console.log("address validation done ");
        const editedAddress = await this._userServices.editAddress({
          _id,
          addressId,
          values,
        });
        if (editedAddress) {
          res.status(OK).json({
            success: true,
            message: "Address edited  added successfully",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "Address editing  failed" });
        }
      } else {
        console.log("address validation failed while editing the address");
        res.status(BAD_REQUEST).json({
          success: false,
          message: "address validation fialed while editing the address",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "Enterd in the address funciton in the backend userController"
      );
      const { userId, addressId } = req.body;
      console.log("userId and addressId is ", userId, addressId);
      const updatedDefaultAddress =
        await this._userServices.setUserDefaultAddress({ userId, addressId });
      if (updatedDefaultAddress) {
        res.status(OK).json({
          success: true,
          message: "Default address updated successfully",
        });
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Default address updation failed" });
      }
    } catch (error){
      console.log(error as Error);
      next(error);
    }
  }

  //function to register the service
  async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the register service in the backend userController"
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

  //function to update the userLocation after singup and again login
  async updateUserLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, locationData } = req.body;
      console.log(
        "Entered in the updateUserLocation in the userController is ",
        userId,
        locationData
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
        search
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
    next: NextFunction
  ) {
    try {
      const { userId } = req.query;
      console.log(
        "userId in the userController in the getAllUserRegisteredService",
        userId
      );

      const page = 1;
      const limit = 25;
      const searchQuery = "";
      const allRegisteredUserServices =
        await this._userServices.getAllUserRegisteredServices(
          page,
          limit,
          searchQuery,
          userId as string
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
        error as Error
      );
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

  //function to get the specified userComplaint using user Id
  async getUserRegisteredServiceDetailsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.query;
      console.log(
        "Enterd in the getUserRegisteredServiceDetailsById function in the userController with id",
        id
      );

      const result =
        await this._userServices.getUserRegisteredServiceDetailsById(
          id as string
        );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  //getting mechanic details  in the usercontroller.
  async getMechanicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "id reached in the userController for getting mech details",
        id
      );
      if (typeof id === "string") {
        const result = await this._userServices.getMechanicDetails({ id });
        res.status(OK).json({ success: true, result: result });
      } else {
        console.log(
          "Id is undifined in the getMechanicDetails in userController"
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
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId } = req.query;
      console.log(
        "entered in the successPayment function in the userController"
      );
      console.log("sessionId from the frontend is ", sessionId);
      const result = await this._userServices.successPayment(
        sessionId as string
      );
      console.log("result from the successPayment in the userController");
      res.status(OK).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Entered in the function for logout");

      // Clear the access_token and refresh_token cookies
      res
        .clearCookie("user_access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("user_refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

      // Send a success response
      res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportData } = req.body;
      console.log(
        "Datas from the frontend  in the createReportFunciton in the userController is ",
        reportData
      );
      const result = await this._reportService.createReport(reportData);
      res.status(200).json({ success: true, result });
      return null;
    } catch (error) {
      console.log(
        "Error occured in the createReport function in the userController",
        error
      );
      next(error);
    }
  }

  //funtion to remove the address
  async handleRemoveUserAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, addressId } = req.body;
      console.log("address, id in the userController is", userId, addressId);
      const result = await this._userServices.handleRemoveUserAddress(
        userId as string,
        addressId as string
      );
      if (result) {
        res.status(200).json({ success: true, result });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      console.log(
        "Error occured while handling the remove Address function in the userController",
        error
      );
      next(error);
    }
  }

  //function to getAllUserAddress
  async getAllAddressOfUser(req:Request,res:Response,next:NextFunction) {
    try{
      const {userId} = req.query;
      console.log("Entered in the userController for accessing the userAddress with userId  ",userId);
      const result = await this._userServices.getAllAddressOfUser(userId as string);
      console.log("result from the controller is ",result);
      if(result) {
        res.status(200).json({success:true,result});
      }else{
        res.status(200).json({success:false});
      }
      
    }catch(error){
      console.log("Error occured while accessing userAddress in userController",error);
      next(error);
    }
  }
}

export default userController;
