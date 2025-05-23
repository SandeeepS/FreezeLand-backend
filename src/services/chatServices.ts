import {
  getComplaintDetailsResponse,
  MessageData,
  MessageDataResponse,
} from "../interfaces/DTOs/Chat/IServices";
import IChatRepository from "../interfaces/IRepository/IChatRepository";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IChatServices from "../interfaces/IServices/IChatServices";

class ChatServices implements IChatServices {
  constructor(
    private chatRepository: IChatRepository,
    private concernRepository: IConcernRepository
  ) {
    this.chatRepository = chatRepository;
    this.concernRepository = concernRepository;
  }


  //function to get the existing messagaes 
  async getMessagesByRoomId(roomId:string):Promise<unknown>{
    try{
        console.log("Enterd in the getMessageByRoomId",roomId);
        const result = await this.chatRepository.getMessagesByRoomId(roomId);
        return result;
    }catch(error){
        console.log(error as Error);
        throw error;
    }
  }


  //function to create message 
  async createMessage(
    messageData: MessageData
  ): Promise<MessageDataResponse | null> {
    try {
      const { roomId, message, senderId, sendAt, senderType } = messageData;
      return await this.chatRepository.createMessage({
        roomId,
        message,
        senderId,
        sendAt,
        senderType,
      });
    } catch (error) {
      console.error("Error in chat service while creating message:", error);
      throw error;
    }
  }

  //function to getting the specified complinat using id
  async getComplaintDetails(
    id: string
  ): Promise<getComplaintDetailsResponse[]> {
    try {
      console.log("Enterdin the mechService");
      const result = await this.concernRepository.getComplaintDetails(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured while getting the specified Complaint by id in the mechServices  ",
        error as Error
      );
      throw error;
    }
  }
}

export default ChatServices;
