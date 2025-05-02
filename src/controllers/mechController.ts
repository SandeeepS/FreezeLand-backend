import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";

import mechService from "../services/mechServices";
const { BAD_REQUEST, OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
import { LoginValidation, SignUpValidation } from "../utils/validator";
import { IMechController } from "../interfaces/IController/IMechController";
import {
  ForgotResentOtpResponse,
  VerifyForgotOtpMech,
} from "../interfaces/DTOs/User/IController.dto";
import {
  GetImageUrlResponse,
  GetPreSignedUrlResponse,
} from "../interfaces/DTOs/Mech/IController.dto";
import { compareInterface } from "../utils/comparePassword";
import { ICreateJWT } from "../utils/generateToken";
import { Iemail } from "../utils/email";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../awsConfig";
import concernModel from "../models/concernModel";

class mechController implements IMechController {
  constructor(
    private mechServices: mechService,
    private encrypt: compareInterface,
    private createdjwt: ICreateJWT,
    private email: Iemail
  ) {
    this.mechServices = mechServices;
    this.encrypt = encrypt;
    this.createdjwt = createdjwt;
    this.email = email;
  }
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async mechSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // try {
    //   console.log("req body is ", req.body);
    //   req.app.locals.mechData = req.body;
    //   const { name, email, phone, password, cpassword } = req.body;
    //   console.log(
    //     "mechanic details from the req body in the mechSignup in mech Controller ",
    //     name,
    //     email,
    //     phone,
    //     password,
    //     cpassword
    //   );
    //   const check = SignUpValidation(name, phone, email, password, cpassword);
    //   if (check) {
    //     const newMechanic = await this.mechServices.signupMech(
    //       req.app.locals.mechData
    //     );

    //     if (!newMechanic) {
    //       req.app.locals.newMechanic = true;
    //       req.app.locals.mechData = req.body;
    //       req.app.locals.mechEmail = req.body.email;

    //       const otp = await this.email.generateAndSendOTP(email);
    //       req.app.locals.mechOtp = otp;

    //       const expirationMinutes = 1;
    //       setTimeout(() => {
    //         delete req.app.locals.mechOtp;
    //       }, expirationMinutes * 60 * 1000);

    //       res.status(OK).json({
    //         mechId: null,
    //         success: true,
    //         message: "OTP sent for verification...",
    //       });
    //     } else {
    //       res
    //         .status(BAD_REQUEST)
    //         .json({ success: false, message: "The email is already in use!" });
    //     }
    //   } else {
    //     console.log("mechanic details validation from the backend is failed");
    //     res.status(UNAUTHORIZED).json({
    //       success: false,
    //       message: "Please enter  valid mechanic  details !!",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error as Error);
    //   next(error);
    // }

    //////////////////////new implimented code is below
    try {
      const mechData = req.body;
      console.log("Details from the mechSignuppage (frontend) is ", mechData);
      const result = await this.mechServices.mechRegistration(mechData);
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
    }
  }

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

      const result = await this.mechServices.verifyOTP(id, otp);
      if (result.success) {
        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours

        res
          .status(200)
          .cookie("mech_access_token", result.access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .cookie("mech_refresh_token", result.refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })
          .json({
            success: true,
            message: result.message,
            mechId: result.mechId,
            data: result.data,
          });
      } else {
        // Handle different failure scenarios with appropriate status codes
        switch (result.message) {
          case "Temporary mech data not found":
            res.status(404).json({
              success: false,
              message: result.message,
            });
            break;
          case "Invalid OTP":
            res.status(401).json({
              success: false,
              message: result.message,
            });
            break;
          case "Mech data not found":
            res.status(404).json({
              success: false,
              message: result.message,
            });
            break;
          case "Mechanic creation failed or role not defined":
            res.status(500).json({
              success: false,
              message: result.message,
            });
            break;
          default:
            res.status(400).json({
              success: false,
              message: result.message || "Verification failed",
            });
        }
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
    }
  }

  async mechLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const check = LoginValidation(email, password);
      if (check) {
        const loginStatus = await this.mechServices.mechLogin({
          email,
          password,
        });
        console.log(loginStatus);
        if (
          loginStatus &&
          loginStatus.data &&
          typeof loginStatus.data == "object" &&
          "token" in loginStatus.data
        ) {
          if (!loginStatus.data.success) {
            res
              .status(UNAUTHORIZED)
              .json({ success: false, message: loginStatus.data.message });
            return;
          }
          const access_token = loginStatus.data.token;
          const refresh_token = loginStatus.data.refresh_token;
          const accessTokenMaxAge = 5 * 60 * 1000;
          const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
          res
            .status(loginStatus.status)
            .cookie("mech_access_token", access_token, {
              maxAge: accessTokenMaxAge,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Set to true in production
              sameSite: "strict",
            })
            .cookie("mech_refresh_token", refresh_token, {
              maxAge: refreshTokenMaxAge,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Set to true in production
              sameSite: "strict",
            })
            .json(loginStatus);
        } else {
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: "Authentication error" });
        }
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ success: false, message: "Check the email and password" });
      }
    } catch (error) {
      next(error);
    }
  }

  async forgotResentOtpMech(
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
      const mech = await this.mechServices.getUserByEmail(email);
      if (!mech) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "mech with email is not exist!",
        }) as ForgotResentOtpResponse;
      }
      const otp = await this.email.generateAndSendOTP(email);
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
      const result = await this.mechServices.updateNewPassword({
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

      const data = await this.mechServices.getAllMechanics({
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
      const data = await this.mechServices.getDevcies();
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
      const data = await this.mechServices.VerifyMechanic(values);
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
        const result = await this.mechServices.getMechanicDetails({ id });
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
      const result = await this.mechServices.getS3SingUrlForMechCredinential({
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
      console.log(
        "userId in the mechController in the getAllUserRegisteredService"
      );
      const page = 1;
      const limit = 10;
      const searchQuery = "";
      const allRegisteredUserServices =
        await this.mechServices.getAllUserRegisteredServices(
          page,
          limit,
          searchQuery
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
      const result = await this.mechServices.getComplaintDetails(id as string);
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
      const { complaintId, mechanicId, status } = req.body;
      console.log(
        "Entered in the updateWorkAssigned function in mechController",
        complaintId,
        mechanicId,
        status
      );
      const result = await this.mechServices.updateWorkAssigned(
        complaintId,
        mechanicId,
        status
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
      const result = await this.mechServices.getAllAcceptedServices(
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
      const result = await this.mechServices.updateComplaintStatus(
        complaintId,
        nextStatus
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  async mechLogout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Entered in the function for logout of mech");
      res
        .clearCookie("mech_access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Match the same settings as in login
          sameSite: "strict",
        })
        .clearCookie("mech_refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Match the same settings as in login
          sameSite: "strict",
        });
      res
        .status(200)
        .json({ success: true, message: "user logout - clearing cookie" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default mechController;
