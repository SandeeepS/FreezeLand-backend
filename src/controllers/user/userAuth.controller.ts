import { Request, Response, NextFunction } from "express";
import { IUserAuthController } from "../../interfaces/IController/user/IUserAuthController";
import { IUserServices } from "../../interfaces/IServices/IUserServices";
import { ForgotResentOtpResponse } from "../../interfaces/dataContracts/User/IController.dto";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import { Iemail } from "../../utils/email";
const { BAD_REQUEST, OK } = STATUS_CODES;

class UserAuthController implements IUserAuthController {
  constructor(private _userServices: IUserServices, private _email: Iemail) {
    this._userServices = _userServices;
    this._email = _email;
  }

  async userSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = req.body;
      console.log("userDetails from the frontend is.", userData);

      const result = await this._userServices.userRegister(userData);
      res.status(201).json({ success: true, result }); // 201 Created for successful registration
    } catch (error) {
      console.log(error as Error);

      const err = error as Error;
      if (err.message === "Invalid user data") {
        res.status(400).json({ success: false, message: "Invalid user data" });
      } else if (err.message === "Email already exists") {
        res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      } else if (err.message === "Failed to generate OTP") {
        res
          .status(500)
          .json({ success: false, message: "Failed to generate OTP" });
      } else {
        // For unexpected errors
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
      next(error);
    }
  }
  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, otp } = req.body;
      console.log(" id and otp in the userController is ", id, otp);

      if (!id || !otp) {
        res.status(400).json({
          success: false,
          message: "ID and OTP are required",
        });
      }

      const result = await this._userServices.verifyOTP(id, otp);

      if (result.success) {
        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours

        res
          .status(200) // 200 OK for successful verification
          .cookie("user_access_token", result.token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("user_refresh_token", result.refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({
            success: true,
            message: result.message,
            userId: result.userId,
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
      const { tempUserId } = req.body;
      console.log(
        "TempUserId in the resend OTP in the ressend otp function in the userController",
        tempUserId
      );
      const response = await this._userServices.resendOTP({ tempUserId });
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
        "Error occured in the resendOTP in the userController",
        error
      );
      res.status(500).json({
        success: false,
        message: "An Error occured while resending OTP",
      });
      next(error);
    }
  }

  //getting the tempuserDAta from the backend for veriy the otp
  async getTempUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.query;
      console.log("id of the tempUserData is ", id);
      const result = await this._userServices.getTempUserData(id as string);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async forgotPassWord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ForgotResentOtpResponse | void> {
    try {
      const { email } = req.body;
      console.log(
        "email in the userController in the forgot password function",
        email
      );
      req.app.locals.userEmail = email;
      if (!email) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "please enter the email",
        }) as ForgotResentOtpResponse;
      }
      const user = await this._userServices.getUserByEmail({ email });
      if (!user) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "user with email is not exist!",
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
        data: user,
        message: "OTP sent for verification...",
      } as ForgotResentOtpResponse);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async VerifyForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const otp = req.body.otp;
      console.log("otp from the req body is ", otp);
      if (!otp)
        return res.json({ success: false, message: "Please enter the otp!" });
      if (!req.app.locals.resendOtp)
        return res.json({ success: false, message: "Otp is expired!" });
      if (otp === req.app.locals.resendOtp)
        res.json({ success: true, message: "both otp are same." });
      else res.json({ success: false, message: "Entered otp is not correct!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in the backend userLogin in userController");
      const { email, password }: { email: string; password: string } = req.body;

      const loginStatus = await this._userServices.userLogin({
        email,
        password,
        role: "user",
      });

      console.log("user login status:", loginStatus);

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
          .cookie("user_access_token", access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("user_refresh_token", refresh_token, {
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

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("entered in the backend googleLogin in userController");
      const { name, email, googlePhotoUrl } = req.body;
      console.log("name and email from the google login", name, email);

      const loginStatus = await this._userServices.googleLogin({
        name,
        email,
        googlePhotoUrl,
      });

      console.log("google login status:", loginStatus);

      if (loginStatus.data.success === false) {
        res.status(loginStatus.status).json({
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
          .cookie("user_access_token", access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .cookie("user_refresh_token", refresh_token, {
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
  //funciton to update New password
  async updateNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, userId } = req.body;
      const result = await this._userServices.updateNewPassword({
        password,
        userId,
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
}

export default UserAuthController;
