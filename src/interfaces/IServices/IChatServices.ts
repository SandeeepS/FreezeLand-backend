import { getComplaintDetailsResponse, MessageData, MessageDataResponse } from "../DTOs/Chat/IServices";

export interface IChatServices {
  createMessage(messageData: MessageData): Promise<MessageDataResponse | null>;
  getComplaintDetails(id: string): Promise<getComplaintDetailsResponse[]>
  getMessagesByRoomId(roomId:string):Promise<unknown>
}
export default IChatServices;
