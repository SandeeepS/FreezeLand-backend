import mongoose from "mongoose";

export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId;
  message: string;
  senderId: mongoose.Types.ObjectId;
  sendAt: Date;
  senderType: string;
  isDeleted: boolean;
}