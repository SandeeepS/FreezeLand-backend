import {Request,Response, NextFunction } from "express";

export interface IAdminConcernController {
    getAllComplaints(req: Request, res: Response, next: NextFunction):Promise<void>
    getComplaintById(req: Request, res: Response, next: NextFunction) :Promise<void>
    cancelComplaint(req: Request, res: Response, next: NextFunction):Promise<void>
}