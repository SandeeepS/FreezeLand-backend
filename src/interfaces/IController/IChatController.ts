import {Request,Response, NextFunction } from "express";
import { MessageData } from "../DTOs/Chat/IController";

export interface IChatController{
   saveMessage(messageData: MessageData):Promise<unknown>
   getComplaintDetails(req: Request, res: Response, next: NextFunction):Promise<void>

}
export default IChatController;