import { MessageData, MessageDataResponse } from "../DTOs/Chat/IRepository";

export interface IChatRepository{
createMessage(messageData: MessageData):Promise<MessageDataResponse | null>
getMessagesByRoomId(roomId:string):Promise<unknown>
}

export default IChatRepository;