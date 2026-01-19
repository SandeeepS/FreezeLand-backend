import {Request,Response, NextFunction } from "express";

export interface IMechanicServiceController{
    getAllUserRegisteredServices(req: Request,res: Response,next: NextFunction):Promise<void>
    getComplaintDetails(req: Request, res: Response, next: NextFunction):Promise<void>
    updateWorkAssigned(req: Request, res: Response, next: NextFunction):Promise<void>
    getAllAcceptedServices(req: Request,res: Response,next: NextFunction):Promise<void>
    updateComplaintStatus(req: Request, res: Response, next: NextFunction):Promise<void>
    updateWorkDetails(req: Request, res: Response, next: NextFunction):Promise<void>
    getAllCompletedServices(req: Request,res: Response,next: NextFunction):Promise<void>
}