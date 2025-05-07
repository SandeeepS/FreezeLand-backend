// messageModel.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  room: mongoose.Types.ObjectId;
  content: string;
  sender: mongoose.Types.ObjectId;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  room: { type: mongoose.Types.ObjectId, required: true, index: true },
  content: { type: String, required: true },
  sender: { type: mongoose.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
});

const messageModel: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);

export default messageModel;
