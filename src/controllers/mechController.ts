import { Request,Response } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import mechService from "../services/mechServices";
import Cryptr from "cryptr";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;

class mechController{
    constructor(private mechServices:mechService){}
    milliseconds = (h: number, m: number, s: number) =>
        (h * 60 * 60 + m * 60 + s) * 1000;


    async mechSignup(req: Request, res: Response): Promise<void> {
        try {
          console.log("req body is ", req.body);
          req.app.locals.mechData = req.body;
          console.log(
            "User detials from userController is ",
            req.app.locals.mechData
          );
          const newMechanic = await this.mechServices.signupMech(
            req.app.locals.mechData
          );
          console.log("enterd into the backend");
          console.log(newMechanic);
          if (newMechanic) {
            res
              .status(OK)
              .json({ success: true, message: "Registered Successfully" });
          }
        } catch (error) {
          console.log(error as Error);
        }
      }

    async mechLogin(req: Request, res: Response): Promise<void> {
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
          res
            .status(INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Internal server error" });
        }
      }

      async mechLogout(req: Request, res: Response) {
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
          res
            .status(INTERNAL_SERVER_ERROR)
            .json({ success: false, message: "Internal server error" });
        }
      }

}

export default mechController;