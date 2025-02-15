import { Request,Response,NextFunction } from "express";
import { ForgotResentOtpResponse, VerifyForgotOtpMech } from "../DTOs/User/IController.dto";

export interface IMechController{
    mechSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
    veryfyMechOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    mechLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotResentOtpMech(req: Request, res: Response, next: NextFunction): Promise<ForgotResentOtpResponse | void>;
    VerifyForgotOtpMech(req: Request, res: Response, next: NextFunction):Promise<VerifyForgotOtpMech | void> ;
    updateNewPasswordMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllMechanics(req: Request, res: Response, next: NextFunction): Promise<void>;
    mechLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
}