import { Request, Response ,NextFunction} from "express";
import userService from "../services/userService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/generateOtp";
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;

class userController {
  constructor(private userServices: userService) {}
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async userSignup(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      req.app.locals.userData = req.body;
      const newUser = await this.userServices.userSignup(
        req.app.locals.userData
      );
      if (!newUser) {
        req.app.locals.newUser = true;
        req.app.locals.userData = req.body;
        req.app.locals.userEmail = req.body.email;
        const otp = await generateAndSendOTP(req.body.email);
        req.app.locals.userOtp = otp;

        const expirationMinutes = 1;
        setTimeout(() => {
          delete req.app.locals.userOtp;
        }, expirationMinutes * 60 * 1000);

        res
          .status(OK)
          .json({
            userId: null,
            success: true,
            message: "OTP sent for verification...",
          });
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "The email is already in use!" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async userLogin(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const loginStatus = await this.userServices.userLogin(email, password);
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
        const time = this.milliseconds(23, 30, 0);
        const access_token = loginStatus.data.token;
        const refresh_token = loginStatus.data.refreshToken;
        const accessTokenMaxAge = 5 * 60 * 1000;
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
        res
          .status(loginStatus.status)
          .cookie("access_token", access_token, {
            maxAge: accessTokenMaxAge,
          })
          .cookie("refresh_token", refresh_token, {
            maxAge: refreshTokenMaxAge,
          })
          .json(loginStatus);
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ success: false, message: "Authentication error" });
      }
    } catch (error) {
      console.log(error as Error)
      next();
    } 
  }

  async veryfyOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { otp } = req.body;
      const isNuewUser = req.app.locals.newUser;
      const savedUser = req.app.locals.userData;

      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      if (otp === Number(req.app.locals.userOtp)) {
        console.log(typeof otp);
        console.log(typeof req.app.locals.userOtp);
        if (isNuewUser) {
          const newUser = await this.userServices.saveUser(savedUser);
          req.app.locals = {};
          // const time = this.milliseconds(23, 30, 0);
          res
            .status(OK)
            .cookie("access_token", newUser?.data.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", newUser?.data.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(newUser);
        } else {
          const time = this.milliseconds(23, 30, 0);
          res
            .status(OK)
            .cookie("access_token", isNuewUser.data.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", isNuewUser.data.refresh_token, {
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
      next(error)
    }
  }

  async forgotResentOtp(req: Request, res: Response,next:NextFunction) {
    try {
      const { email } = req.body;
      req.app.locals.userEmail = email;
      if (!email)
        return res
          .status(BAD_REQUEST)
          .json({ success: false, message: "please enter the email" });
      const user = await this.userServices.getUserByEmail(email);
      if (!user)
        return res
          .status(BAD_REQUEST)
          .json({ success: false, message: "user with email is not exist!" });

      const otp = await generateAndSendOTP(email);
      req.app.locals.resendOtp = otp;

      const expirationMinutes = 1;
      setTimeout(() => {
        delete req.app.locals.resendOtp;
      }, expirationMinutes * 60 * 1000);

      res
        .status(OK)
        .json({
          success: true,
          data: user,
          message: "OTP sent for verification...",
        });
    } catch (error) {
      console.log(error as Error);
     next(error)
  }
}

  async VerifyForgotOtp(req: Request, res: Response,next:NextFunction) {
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

  async updateNewPassword(req: Request, res: Response,next:NextFunction) {
    try {
      const { password, userId } = req.body;
      const result = await this.userServices.updateNewPassword(
        password,
        userId
      );
      console.log(result);
      if (result)
        res.json({ success: true, data: result, message: "successful" });
      else res.json({ success: false, message: "somthing went wrong!" });
    } catch (error) {
      console.log(error as Error);
      next(error)
    }
  }

  async logout(req: Request, res: Response,next: NextFunction) {
    try {
      res
        .cookie("access_token", "", {
          maxAge: 0,
        })
        .cookie("refresh_token", "", {
          maxAge: 0,
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

export default userController;
