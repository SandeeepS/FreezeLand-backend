import {Request,Response, NextFunction } from "express";

export interface IAdminDeviceController {
    addNewDevice(req: Request, res: Response, next: NextFunction):Promise<void> 
    getAllDevices(req: Request, res: Response, next: NextFunction):Promise<void>
    listUnlistDevices(req: Request, res: Response, next: NextFunction):Promise<void>
    deleteDevice(req: Request, res: Response, next: NextFunction):Promise<void>
}