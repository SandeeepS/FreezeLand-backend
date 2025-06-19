import {Request,Response, NextFunction } from "express";
import { GetPreSignedUrlResponse } from "../dataContracts/Admin/IController.dto";

export interface IAdminController{
    adminLogin( req: Request, res: Response,next: NextFunction):Promise<void>;
    getUserList( req: Request, res: Response, next: NextFunction):Promise<void>
    getMechList( req: Request, res: Response, next: NextFunction):Promise<void>;
    blockUser( req: Request, res: Response, next: NextFunction ):Promise<void>;
    blockMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMech(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<GetPreSignedUrlResponse|void>;
    addNewServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getService(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMechanicById( req:Request,res:Response,next:NextFunction):Promise<void> 
    editExistingService(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
    adminLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateApprove (req:Request,res:Response,next:NextFunction) :Promise<void>;
}