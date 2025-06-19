import mongoose from "mongoose";

export interface MessageData {
    roomId: string;
    message: string;
    senderId: string;
    sendAt: Date;
    senderType:string;

}

export interface MessageDataResponse{
    _id?:mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    message: string;
    senderId: mongoose.Types.ObjectId;
    sendAt: Date;
    senderType:string;

}

