import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import mechService from "../services/mechServices";
import { generateAndSendOTP } from "../utils/generateOtp";
const { BAD_REQUEST, OK, UNAUTHORIZED } = STATUS_CODES;
import { LoginValidation, SignUpValidation } from "../utils/validator";
import { IMechController } from "../interfaces/IController/IMechController";
import {
  ForgotResentOtpResponse,
  VerifyForgotOtpMech,
} from "../interfaces/DTOs/User/IController.dto";

class mechController implements IMechController {
  constructor(private mechServices: mechService) {}
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async mechSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("req body is ", req.body);
      req.app.locals.mechData = req.body;
      const { name, email, phone, password, cpassword } = req.body;
      console.log(
        "mechanic details from the req body in the mechSignup in mech Controller ",
        name,
        email,
        phone,
        password,
        cpassword
      );
      const check = SignUpValidation(name, phone, email, password, cpassword);
      if (check) {
        const newMechanic = await this.mechServices.signupMech(
          req.app.locals.mechData
        );

        if (!newMechanic) {
          req.app.locals.newMechanic = true;
          req.app.locals.mechData = req.body;
          req.app.locals.mechEmail = req.body.email;

          const otp = await generateAndSendOTP(email);
          req.app.locals.mechOtp = otp;

          const expirationMinutes = 1;
          setTimeout(() => {
            delete req.app.locals.mechOtp;
          }, expirationMinutes * 60 * 1000);

          res.status(OK).json({
            mechId: null,
            success: true,
            message: "OTP sent for verification...",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "The email is already in use!" });
        }
      } else {
        console.log("mechanic details validation from the backend is failed");
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please enter  valid mechanic  details !!",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async veryfyMechOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp } = req.body;
      const isNuewMech = req.app.locals.newMechanic;
      console.log("new Mechanic is ", isNuewMech);
      const savedMech = req.app.locals.mechData;

      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      if (otp === Number(req.app.locals.mechOtp)) {
        console.log("cehcking the type ", typeof otp);
        console.log(typeof req.app.locals.mechOtp);

        if (isNuewMech) {
          const newMech = await this.mechServices.saveMech(savedMech);
          req.app.locals = {};
          res
            .status(OK)
            .cookie("access_token", newMech?.data.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", newMech?.data.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(newMech);
        } else {
          res
            .status(OK)
            .cookie("access_token", isNuewMech.data.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", isNuewMech.data.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json({ success: true, message: "old user verified" });
        }
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Incorrect otp !" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
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
        return res
          .status(BAD_REQUEST)
          .json({
            success: false,
            message: "mech with email is not exist!",
          }) as ForgotResentOtpResponse;
      }
      const otp = await generateAndSendOTP(email);
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
