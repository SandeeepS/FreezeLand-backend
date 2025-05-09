import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServices extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge: number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

const serviceSchema: Schema<IServices> = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageKey: {
    type: String,
    required: false,
  },
  discription: {
    type: [String],
    required: true,
  },
  serviceCharge: {
    type: Number,
    required: false,
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

const serviceModel: Model<IServices> = mongoose.model<IServices>(
  "Services",
  serviceSchema
);
export default serviceModel;
