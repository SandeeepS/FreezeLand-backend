import mongoose, { Schema, Document, Model } from "mongoose";

const AddressSchema = new Schema({
  name: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  state: { type: String, require: true },
  pin: { type: Number, require: true },
  district: { type: String, require: true },
  landMark: { type: String, require: true },
});

export interface UserInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  isBlocked: boolean;
  isDeleted: boolean;
}

const userSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  profile_picture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png",
  },
  address: {
    type: [AddressSchema],
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

const userModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "User",
  userSchema
);
export default userModel;
