import {Request,Response, NextFunction } from "express";

export interface IAdminMechanicManagementController {
     getMechList( req: Request, res: Response, next: NextFunction):Promise<void>;
    blockMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMechanicById( req:Request,res:Response,next:NextFunction):Promise<void> 

}
