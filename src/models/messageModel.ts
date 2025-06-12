// messageModel.ts
import mongoose, { Schema, Model } from "mongoose";
import { IMessage } from "../interfaces/Model/IChat";

const MessageSchema: Schema = new Schema({
  roomId: { type: mongoose.Types.ObjectId, required: true, index: true },
  message: { type: String, required: true },
  senderId: { type: mongoose.Types.ObjectId, required: true },
  sendAt: { type: Date, default: Date.now },
  senderType:{type:String},
  isDeleted:{type:Boolean,default:false}
});

const messageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);

export default messageModel;
