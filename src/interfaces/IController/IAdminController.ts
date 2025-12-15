import {Request,Response, NextFunction } from "express";
import { GetPreSignedUrlResponse } from "../dataContracts/Admin/IController.dto";

export interface IAdminController{
    
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<GetPreSignedUrlResponse|void>;
    updateApprove (req:Request,res:Response,next:NextFunction) :Promise<void>;
}