import {Request,Response, NextFunction } from "express";

export interface IMechanicChatController{
     createRoom(req: Request, res: Response, next: NextFunction):Promise<void>
     getComplaintDetails(req: Request, res: Response, next: NextFunction):Promise<void>

}