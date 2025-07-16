import {
  getComplaintDetailsResponse,
  MessageData,
  MessageDataResponse,
} from "../interfaces/dataContracts/Chat/IServices";
import IChatRepository from "../interfaces/IRepository/IChatRepository";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IChatServices from "../interfaces/IServices/IChatServices";

class ChatServices implements IChatServices {
  constructor(
    private _chatRepository: IChatRepository,
    private _concernRepository: IConcernRepository
  ) {
    this._chatRepository = _chatRepository;
    this._concernRepository = _concernRepository;
  }

  //function to get the existing messagaes
  async getMessagesByRoomId(roomId: string): Promise<unknown> {
    try {
      console.log("Enterd in the getMessageByRoomId", roomId);
      const result = await this._chatRepository.getMessagesByRoomId(roomId);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async createMessage(
    messageData: MessageData
  ): Promise<MessageDataResponse | null> {
    try {
      const { roomId, message, senderId, sendAt, senderType } = messageData;
      return await this._chatRepository.createMessage({
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
  ): Promise<getComplaintDetailsResponse[]>{
    try {
      console.log("Enterdin the mechService");
      const result = await this._concernRepository.getComplaintDetails(id);
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
