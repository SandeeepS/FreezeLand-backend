import { Request, Response } from "express";
import userService from "../services/userService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { generateAndSendOTP } from "../utils/generateOtp";
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;


class userController {
  constructor(private userServices: userService) {}
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async userSignup(req: Request, res: Response): Promise<void> {
    try {
        req.app.locals.userData = req.body;
        const newUser = await this.userServices.userSignup(req.app.locals.userData);
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

            res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });

        } else {
            res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
        }
    } catch (error) {
        console.log(error as Error)
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
    }
}

  async userLogin(req: Request, res: Response): Promise<void> {
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
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }


  async veryfyOtp(req: Request, res: Response): Promise<void> {
    try {
        const { otp } = req.body;
        const isNuewUser = req.app.locals.newUser;
        const savedUser = req.app.locals.userData;

     

        const accessTokenMaxAge = 5 * 60 * 1000;
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
 

        if (otp === Number(req.app.locals.userOtp)) {
          console.log(typeof(otp))
          console.log(typeof(req.app.locals.userOtp))
            if (isNuewUser) {
                const newUser = await this.userServices.saveUser(savedUser);
                req.app.locals = {};
                // const time = this.milliseconds(23, 30, 0);
                res.status(OK).cookie('access_token', newUser?.data.token, {
                    maxAge: accessTokenMaxAge
                }).cookie('refresh_token', newUser?.data.refresh_token, {
                    maxAge: refreshTokenMaxAge
                }).json(newUser);
            } else {
                const time = this.milliseconds(23, 30, 0);
                res.status(OK).cookie('access_token', isNuewUser.data.token, {
                    maxAge: accessTokenMaxAge
                }).cookie('refresh_token', isNuewUser.data.refresh_token, {
                    maxAge: refreshTokenMaxAge
                }).json({ success: true, message: 'old user verified' });
            }
        } else {
            res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect otp !' });
        }
    } catch (error) {
        console.log(error as Error);
        res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server Error.' });
    }
}

  async logout(req: Request, res: Response) {
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
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const currentUser = await this.userServices.getProfile(req.userId);
      if (!currentUser)
        res
          .status(UNAUTHORIZED)
          .json({ success: false, message: "Authentication failed..!" });
      else if (currentUser?.isBlocked)
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "user has been blocked by the admin!",
        });
      else res.status(OK).json(currentUser);
    } catch (error) {
      console.log(error as Error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }
}

export default userController;
