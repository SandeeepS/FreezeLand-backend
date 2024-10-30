import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServices extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

const serviceSchema: Schema<IServices> = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  discription: {
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

const serviceModel: Model<IServices> = mongoose.model<IServices>(
  "Services",
  serviceSchema
);
export default serviceModel;
