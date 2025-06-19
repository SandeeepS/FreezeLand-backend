import { MessageData, MessageDataResponse } from "../dataContracts/Chat/IRepository";

export interface IChatRepository{
createMessage(messageData: MessageData):Promise<MessageDataResponse | null>
getMessagesByRoomId(roomId:string):Promise<unknown>
}

export default IChatRepository;