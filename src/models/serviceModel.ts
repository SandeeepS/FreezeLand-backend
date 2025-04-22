import mongoose, { Schema, Model } from "mongoose";
import { IServices } from "../interfaces/Model/IService";

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
