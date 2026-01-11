import { Request,Response,NextFunction } from "express";
import { GetImageUrlResponse } from "../dataContracts/User/IController.dto";

export interface IUserController{
    
    // User Management 
 

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
    getAllUserRegisteredServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserRegisteredServiceDetailsById(req:Request,res:Response,next:NextFunction):Promise<void>;

    // Utility Methods
    getImageUrl(req: Request, res: Response, next: NextFunction): Promise<GetImageUrlResponse | void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;

}