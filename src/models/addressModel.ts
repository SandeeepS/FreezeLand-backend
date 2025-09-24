import mongoose, { Model, Schema } from "mongoose";
import { IAddress } from "../interfaces/Model/IAddress";

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    addressType: {
      type: String,
      enum: ["Work", "Home"],
      default: "Home",
    },
    fullAddress: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isDefaultAddress: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const addressModel: Model<IAddress> = mongoose.model<IAddress>(
  "address",
  addressSchema
);

export default addressModel;
