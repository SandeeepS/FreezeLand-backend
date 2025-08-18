import mongoose, { Model, Schema } from "mongoose";
import { IAddress } from "../interfaces/Model/IAddress";

const addressFieldsSchema = new Schema({
  name: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  state: { type: String, require: true },
  pin: { type: Number, require: true },
  district: { type: String, require: true },
  landMark: { type: String, require: true },
  isDeleted: { type: Boolean, default: false },
});

const addressItemSchema = new Schema(
  {
    id: { type: Number, required: true },
    address: { type: addressFieldsSchema, required: true },
  },
  { _id: false }
);

const addressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  defaultAddress: {
    type: Number,
    required: true,
  },
  addresses: {
    type: [addressItemSchema],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const addressModel: Model<IAddress> = mongoose.model<IAddress>(
  "address",
  addressSchema
);

export default addressModel;
