import { Request,Response,NextFunction } from "express";

export interface IServiceController {
    
        registerService(req: Request, res: Response, next: NextFunction): Promise<void>;
        getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
        getAllUserRegisteredServices(req: Request, res: Response, next: NextFunction): Promise<void>;
        getUserRegisteredServiceDetailsById(req:Request,res:Response,next:NextFunction):Promise<void>;

}    
