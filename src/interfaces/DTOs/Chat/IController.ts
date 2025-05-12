export interface MessageData{
    roomId: string;
    message: string;
    senderId: string;
    sendAt: Date;
    senderType:string;
}

export interface MessageDataResponse{
    id:string;
    roomId: string;
    message: string;
    senderId: string;
    sendAt: Date;
    senderType:string;

}