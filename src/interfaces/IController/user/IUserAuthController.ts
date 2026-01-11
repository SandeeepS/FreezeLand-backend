import {Request,Response, NextFunction } from "express";
import { ForgotResentOtpResponse } from "../../dataContracts/User/IController.dto";

export interface IUserAuthController {

       userSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
        userLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
        googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
        verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
        forgotPassWord(req: Request, res: Response, next: NextFunction): Promise<ForgotResentOtpResponse | void>;
        VerifyForgotOtp(req: Request, res: Response, next: NextFunction): Promise<unknown>;
        updateNewPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
