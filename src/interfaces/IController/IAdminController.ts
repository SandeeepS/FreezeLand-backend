import {Request,Response, NextFunction } from "express";
import { GetPreSignedUrlResponse } from "../dataContracts/Admin/IController.dto";

export interface IAdminController{
    getMechList( req: Request, res: Response, next: NextFunction):Promise<void>;
    blockMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<GetPreSignedUrlResponse|void>;
    addNewServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getService(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMechanicById( req:Request,res:Response,next:NextFunction):Promise<void> 
    editExistingService(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateApprove (req:Request,res:Response,next:NextFunction) :Promise<void>;
}