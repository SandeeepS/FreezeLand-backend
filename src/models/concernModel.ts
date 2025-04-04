//model for handling the user compliant

import mongoose, { Schema, Document, Model } from "mongoose";

export interface Iconcern extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId:mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
}

const concernSchema: Schema<Iconcern> = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [],
    required: false,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  defaultAddress: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  locationName: {
    type: Object,
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

const concernModel: Model<Iconcern> = mongoose.model<Iconcern>(
  "Concerns",
  concernSchema
);
export default concernModel;
