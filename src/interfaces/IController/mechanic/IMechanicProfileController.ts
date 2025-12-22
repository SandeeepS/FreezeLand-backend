import {Request,Response, NextFunction } from "express";

export interface IMechanicProfileController {
    editMechanic(req: Request, res: Response, next: NextFunction):Promise<void>
    addAddress(req: Request, res: Response, next: NextFunction):Promise<void>
    getMechanicAddress(req: Request, res: Response, next: NextFunction):Promise<void>
    editAddress(req: Request, res: Response, next: NextFunction):Promise<void>
    
}