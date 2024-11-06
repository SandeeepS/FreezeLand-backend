import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDevice extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const deviceSchema: Schema<IDevice> = new Schema({
  name: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const deviceModel: Model<IDevice> = mongoose.model<IDevice>("Device", deviceSchema);
export default deviceModel;
