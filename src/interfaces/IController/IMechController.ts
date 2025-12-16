import { Request,Response,NextFunction } from "express";

export interface IMechController{
    getAllMechanics(req: Request, res: Response, next: NextFunction): Promise<void>;
    mechLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateWorkDetails(req:Request,res:Response,next:NextFunction):Promise<void>
}