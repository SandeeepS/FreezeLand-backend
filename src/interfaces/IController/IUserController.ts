import { Request,Response,NextFunction } from "express";
import { ForgotResentOtpResponse, GetImageUrlResponse } from "../DTOs/User/IController.dto";


export interface IUserController{
    
    // User Management 
    userSignup(req: Request, res: Response, next: NextFunction): Promise<void>;
    userLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
    veryfyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotResentOtp(req: Request, res: Response, next: NextFunction): Promise<ForgotResentOtpResponse | void>;
    VerifyForgotOtp(req: Request, res: Response, next: NextFunction): Promise<unknown>;
    updateNewPassword(req: Request, res: Response, next: NextFunction): Promise<void>;

    // Profile Management 
    getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    editUser(req: Request, res: Response, next: NextFunction): Promise<void>;

    // Address Management 
    addAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
    editAddress(req: Request, res: Response, next: NextFunction): Promise<void>;
    setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void>;

    // Service Management 
    registerService(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllRegisteredService(req: Request, res: Response, next: NextFunction): Promise<void>;

    // Utility Methods
    getImageUrl(req: Request, res: Response, next: NextFunction): Promise<GetImageUrlResponse | void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}