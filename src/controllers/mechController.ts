import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
const { BAD_REQUEST, OK, NOT_FOUND } = STATUS_CODES;
import { AddressValidation } from "../utils/validator";
import { IMechController } from "../interfaces/IController/IMechController";
import {
  ForgotResentOtpResponse,
  VerifyForgotOtpMech,
} from "../interfaces/dataContracts/User/IController.dto";
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

  //function for singup the mechanic
  async mechSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const mechData = req.body;
      console.log("Details from the mechSignuppage (frontend) is ", mechData);
      const result = await this._mechServices.mechRegistration(mechData);
      res.status(201).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      const err = error as Error;
      if (err.message === "Invalid mech data") {
        res.status(400).json({ success: false, message: "Invalid mech data" });
      } else if (err.message === "Email already exists") {
        res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      } else if (err.message === "Failed to generate OTP") {
        res
          .status(500)
          .json({ success: false, message: "Failed to generate OTP" });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
      next(error);
    }
  }

  //funciton for verifying the mechanic
  async veryfyMechOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, otp } = req.body;
      console.log("id and otp in the userController is ", id, otp);
      if (!id || !otp) {
        res.status(400).json({
          success: false,
          message: "Id and otp are required",
        });
      }

      const result = await this._mechServices.verifyOTP(id, otp);
      if (result.success) {
        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours

        res
          .status(200)
          .cookie("mech_access_token", result.access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("mech_refresh_token", result.refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({
            success: true,
            message: result.message,
            mechId: result.mechId,
            data: result.data,
          });
      } else {
        res.status(200).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.log(error as Error);
      if (
        (error as Error).message ===
        "Encryption secret key is not defined in the environment"
      ) {
        res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "An unexpected error occurred during verification",
        });
      }
      next(error);
    }
  }

  //function for resend OTP
  async resendOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { tempMechId } = req.body;
      console.log(
        "TempMechId in the resend OTP in the ressend otp function in the mechController",
        tempMechId
      );
      const response = await this._mechServices.resendOTP({ tempMechId });
      if (response) {
        res.status(200).json({
          success: true,
          message: "OTP resended Successfully ,\n Check your Mail",
          data: response,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "OTP resend is failed!!",
        });
      }
    } catch (error) {
      console.log(
        "Error occured in the resendOTP in the mechController",
        error
      );
      res.status(500).json({
        success: false,
        message: "An Error occured while resending OTP",
      });
      next(error);
    }
  }

  //for login of mechanic
  async mechLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in the backend mechLogin in mechController");
      const { email, password }: { email: string; password: string } = req.body;

      const loginStatus = await this._mechServices.mechLogin({
        email,
        password,
        role: "mechanic",
      });

      console.log("mechanic login status:", loginStatus);

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
        const accessTokenMaxAge = 5 * 60 * 1000; //5 min
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; //48 h
        console.log("response is going to send to the frontend");
        res
          .status(loginStatus.status)
          .cookie("mech_access_token", access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("mech_refresh_token", refresh_token, {
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

  //for forgot reset otp mechanic
  async forgotPasswordMech(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ForgotResentOtpResponse | void> {
    try {
      const { email } = req.body;
      req.app.locals.mechEmail = email;
      if (!email) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "please enter the email",
        }) as ForgotResentOtpResponse;
      }
      const mech = await this._mechServices.getUserByEmail({ email });
      if (!mech) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "mech with email is not exist!",
        }) as ForgotResentOtpResponse;
      }
      const otp = await this._email.generateAndSendOTP(email);
      req.app.locals.resendOtp = otp;

      const expirationMinutes = 1;
      setTimeout(() => {
        delete req.app.locals.resendOtp;
      }, expirationMinutes * 60 * 1000);

      res.status(OK).json({
        success: true,
        data: mech,
        message: "OTP sent for verification...",
      });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async VerifyForgotOtpMech(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<VerifyForgotOtpMech | void> {
    try {
      const otp = req.body.otp;
      console.log("otp from the req body is ", otp);
      if (!otp)
        return res.json({
          success: false,
          message: "Please enter the otp!",
        }) as VerifyForgotOtpMech;
      if (!req.app.locals.resendOtp)
        return res.json({
          success: false,
          message: "Otp is expired!",
        }) as VerifyForgotOtpMech;
      if (otp === req.app.locals.resendOtp)
        res.json({ success: true, message: "both otp are same." });
      else res.json({ success: false, message: "Entered otp is not correct!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateNewPasswordMech(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, mechId } = req.body;
      console.log(
        "passwrond and mechId in the updateNewPassword in the mechController",
        password,
        mechId
      );
      const result = await this._mechServices.updateNewPassword({
        password,
        mechId,
      });
      console.log(result);
      if (result)
        res.json({ success: true, data: result, message: "successful" });
      else res.json({ success: false, message: "somthing went wrong!" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

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

  async verifyMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const { values } = req.body;
      console.log(
        "reached in the mechController for mech Verification ",
        values
      );
      const data = await this._mechServices.VerifyMechanic(values);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getMechanicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "id reached in the mechController for getting mech details",
        id
      );
      if (typeof id === "string") {
        const result = await this._mechServices.getMechanicDetails({ id });
        res.status(OK).json({ success: true, result: result });
      } else {
        console.log(
          "Id is undifined in the getMechanicDetails in mechController"
        );
        res.status(STATUS_CODES.CONFLICT).json({ success: false });
      }
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

  //function to update the mechnanic profile
  async editMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechId, values } = req.body;
      console.log(
        "Entered in the mechController to update the mechanic profile details",
        mechId,
        values
      );
      const result = await this._mechServices.editMechanic({ mechId, values });
      res.status(OK).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //function to add address
  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "enterd in the addAddress fucniton in the backend mechController"
      );
      const { values, _id } = req.body;
      console.log("id from the mechController while adding address is", _id);
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
        const addedAddress = await this._mechServices.AddUserAddress({
          _id,
          values,
        });
        if (addedAddress) {
          res.status(OK).json({
            success: true,
            message: "mechanic address added successfully",
          });
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: "Mechanic Address addingh failed",
          });
        }
      } else {
        console.log(
          "address validation failed form the addAddress in the mechController"
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

  //editing mechanic address
  async editAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in teh mechanic Controller for editing the address");
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
        const editedAddress = await this._mechServices.editAddress({
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

  async mechLogout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Entered in the function for logout of mech");
      res
        .clearCookie("mech_access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .clearCookie("mech_refresh_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      res
        .status(200)
        .json({ success: true, message: "user logout - clearing cookie" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, mechId } = req.body;
      console.log("entered in the createRoom in the mechControler");
      console.log(`user id is ${userId} and mechId is ${mechId}`);
      const result = await this._mechServices.createRoom({ userId, mechId });
      console.log("result fo createRoom in controller is", this.createRoom);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error);
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

  //funtion to remove the address
  async handleRemoveMechAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { mechId, addressId } = req.body;
      console.log("address id in the mechController is", mechId, addressId);
      const result = await this._mechServices.handleRemoveMechAddress(
        mechId as string,
        addressId as string
      );
      if (result) {
        res.status(200).json({ success: true, result });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      console.log(
        "Error occured while handling the remove Address function in the mechController",
        error
      );
      next(error);
    }
  }
}

export default mechController;
