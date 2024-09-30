import { Request, Response,NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import mechService from "../services/mechServices";
import { generateAndSendOTP } from "../utils/generateOtp";
import { error } from "console";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;

class mechController {
  constructor(private mechServices: mechService) {}
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async mechSignup(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      console.log("req body is ", req.body);
      req.app.locals.mechData = req.body;

      const newMechanic = await this.mechServices.signupMech(
        req.app.locals.mechData
      );

      if (!newMechanic) {
        req.app.locals.newMechanic = true;
        req.app.locals.mechData = req.body;
        req.app.locals.mechEmail = req.body.email;
        const otp = await generateAndSendOTP(req.body.email);
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
    } catch (error) {
      console.log(error as Error);
      next(error)
    }
  }

  async veryfyMechOtp(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { otp } = req.body;
      const isNuewMech = req.app.locals.newMechanic;
      console.log("new Mechanic is ",isNuewMech);
      const savedMech = req.app.locals.mechData;

      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      if (otp === Number(req.app.locals.mechOtp)) {
        console.log("cehcking the type ",typeof otp);
        console.log(typeof req.app.locals.mechOtp);

        if (isNuewMech) {
          const newMech = await this.mechServices.saveMech(savedMech);
          req.app.locals = {};
          // const time = this.milliseconds(23, 30, 0);
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
          const time = this.milliseconds(23, 30, 0);
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

  async mechLogin(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const loginStatus = await this.mechServices.mechLogin(email, password);
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
          .cookie("m_access_token", access_token, {
            maxAge: accessTokenMaxAge,
          })
          .cookie("m_refresh_token", refresh_token, {
            maxAge: refreshTokenMaxAge,
          })
          .json(loginStatus);
      } else {
        res
          .status(UNAUTHORIZED)
          .json({ success: false, message: "Authentication error" });
      }
    } catch (error) {
      next(error)
    }
  }

  async mechLogout(req: Request, res: Response,next:NextFunction) {
    try {
      res
        .cookie("m_access_token", "", {
          maxAge: 0,
        })
        .cookie("m_refresh_token", "", {
          maxAge: 0,
        });
      res
        .status(200)
        .json({ success: true, message: "user logout - clearing cookie" });
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}

export default mechController;
