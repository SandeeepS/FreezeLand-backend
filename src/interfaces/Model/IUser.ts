import mongoose, { Types, Document } from "mongoose";

export interface Address {
  _id: Types.ObjectId;
  name: string;
  phone: number;
  email: string;
  state: string;
  pin: number;
  district: string;
  landMark: string;
}

export interface UserInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  locationData: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: number[]; // [longitude, latitude]
    city: string;
    state: string;
  };
  address: Address[];
  defaultAddress: string;
  role: string;

  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ITempUser extends Document {
  userData: Partial<UserInterface>;
  otp: string;
  createdAt: Date;
  _id: Types.ObjectId;
}
