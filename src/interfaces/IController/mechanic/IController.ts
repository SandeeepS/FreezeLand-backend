import { Request,Response,NextFunction } from "express";

export interface IMechController{
    getAllMechanics(req: Request, res: Response, next: NextFunction): Promise<void>;
}