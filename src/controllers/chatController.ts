//controller for handling chat
import { Request, Response, NextFunction } from "express";
import { MessageData } from "../interfaces/dataContracts/Chat/IController";
import IChatController from "../interfaces/IController/IChatController";
import IChatServices from "../interfaces/IServices/IChatServices";

class ChatController implements IChatController {
  constructor(private chatServices: IChatServices) {
    this.chatServices = chatServices;
  }

  async saveMessage(messageData: MessageData): Promise<unknown> {
    try {
      const savedMessage = await this.chatServices.createMessage({
        roomId: messageData.roomId,
        message: messageData.message,
        senderId: messageData.senderId,
        sendAt: messageData.sendAt,
        senderType: messageData.senderType,
      });
      return savedMessage;
    } catch (error) {
      console.log("Erorr occured while saveMessage in the controller", error);
    }
  }

  //function to get the specified compliant  using compliant Id
  async getComplaintDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.query;
      console.log(
        "Enterd in the getComplaintDetails function in the mechController with id",
        id
      );
      const result = await this.chatServices.getComplaintDetails(id as string);
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }
}

export default ChatController;
