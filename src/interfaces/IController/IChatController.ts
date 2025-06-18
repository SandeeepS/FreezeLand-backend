import { NextFunction } from "express";
import { MessageData } from "../DTOs/Chat/IController";

export interface IChatController{
   saveMessage(messageData: MessageData):Promise<void>
   getComplaintDetails(req: Request, res: Response, next: NextFunction):Promise<void>

}
export default IChatController;