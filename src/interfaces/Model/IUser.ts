import mongoose, { Types, Document } from "mongoose";



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
  address: mongoose.Types.ObjectId;
  defaultAddress: string;
  role: string;
  wallet: number;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ITempUser extends Document {
  userData: Partial<UserInterface>;
  otp: string;
  createdAt: Date;
  _id: Types.ObjectId;
}
