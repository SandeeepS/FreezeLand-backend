import { Request,Response } from "express";
import userService from "../services/userService";
import { STATUS_CODES } from "../constants/httpStatusCodes";
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;


class userController{
    constructor(private userServices:userService){}
    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    async userSignup(req:Request,res:Response):Promise<void>{
        try{
            console.log("req body is ",req.body)
            req.app.locals.userData = req.body;
            console.log("User detials from userController is ", req.app.locals.userData)
            const newUser = await this.userServices.signupUser(req.app.locals.userData);
            console.log("enterd into the backend");
            console.log(newUser);
            if(newUser){
                res.status(OK).json({ success: true, message: 'Registered Successfully' });
            }
        }catch(error){
            console.log(error as Error);
        }
    }

    async userLogin(req:Request,res:Response) : Promise<void>{
        try {
            const { email, password }: { email: string; password: string } = req.body;
            const loginStatus = await this.userServices.userLogin(email, password);
            console.log(loginStatus);
            if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object' && 'token' in loginStatus.data) {
                if (!loginStatus.data.success) {
                    res.status(UNAUTHORIZED).json({ success: false, message: loginStatus.data.message });
                    return;
                }
                const time = this.milliseconds(23, 30, 0);
                const access_token = loginStatus.data.token;
                const refresh_token = loginStatus.data.refreshToken;
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                res.status(loginStatus.status).cookie('access_token', access_token, {
                    maxAge: accessTokenMaxAge,
                }).cookie('refresh_token', refresh_token, {
                    maxAge: refreshTokenMaxAge,
                }).json(loginStatus);
            } else {
                res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication error' });
            }
        } catch (error) {
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie('access_token', '', {
                maxAge: 0
            }).cookie('refresh_token', '', {
                maxAge: 0
            })
            res.status(200).json({ success: true, message: 'user logout - clearing cookie' })
        } catch (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const currentUser = await this.userServices.getProfile(req.userId);
            if (!currentUser) res.status(UNAUTHORIZED).json({ success: false, message: 'Authentication failed..!' });
            else if (currentUser?.isBlocked) res.status(UNAUTHORIZED).json({ success: false, message: 'user has been blocked by the admin!' });
            else res.status(OK).json(currentUser);
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

}

export default userController