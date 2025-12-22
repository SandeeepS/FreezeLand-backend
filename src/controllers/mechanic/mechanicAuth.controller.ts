import { Request, Response, NextFunction } from "express";
import { IMechanicAuthController } from "../../interfaces/IController/mechanic/IMechanicAuthController";
import { IMechServices } from "../../interfaces/IServices/IMechServices";
import {
  ForgotResentOtpResponse,
  VerifyForgotOtpMech,
} from "../../interfaces/dataContracts/User/IController.dto";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { Iemail } from "../../utils/email";
const { BAD_REQUEST, OK } = STATUS_CODES;

class MechanicAuthController implements IMechanicAuthController {
  constructor(private _mechServices: IMechServices, private _email: Iemail) {
    this._mechServices = _mechServices;
    this._email = _email;
  }

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

}

export default MechanicAuthController;
