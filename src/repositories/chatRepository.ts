import mongoose from "mongoose";
import { MessageData, MessageDataResponse } from "../interfaces/dataContracts/Chat/IRepository";
import IChatRepository from "../interfaces/IRepository/IChatRepository";
import { IMessage } from "../interfaces/Model/IChat";
import messageModel from "../models/messageModel";
import { BaseRepository } from "./BaseRepository/baseRepository";


class ChatRepository extends BaseRepository<IMessage & Document> implements IChatRepository{
    constructor(){
        super(messageModel);
    }

    async createMessage(messageData: MessageData):Promise<MessageDataResponse | null>{
        try {
            console.log("message data in the chatRepository",messageData)
            const dataToSave = {
                roomId: new mongoose.Types.ObjectId(messageData.roomId),
                message: messageData.message,
                senderId: new mongoose.Types.ObjectId(messageData.senderId),
                sendAt: messageData.sendAt,
                senderType:messageData.senderType
            };

            const savedMessage = await this.save(dataToSave);
            console.log("saved message from the database si ",savedMessage);
            return savedMessage;
        
        } catch (error) {
          console.error("Error in repository while creating message:", error);
          throw error;
        }
      }

      async getMessagesByRoomId(roomId:string):Promise<unknown>{
        try{
            const  roomIdObject = new  mongoose.Types.ObjectId(roomId)
            console.log("room id from the chatRepository while getting the older messages is",roomId);
            const result = await this.find({roomId:roomIdObject});
            console.log("result after getting the meessages in the userRepository",result);
            return result;
        }catch(error){
            console.log(error as Error);
            throw error;
        }
      }
}

export default ChatRepository;