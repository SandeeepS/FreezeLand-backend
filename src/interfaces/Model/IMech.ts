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


export interface MechInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  mechanicType: string[];
  profile_picture: string;
  adharProof: string;
  employeeLicense: string;
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
  wallet:number;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ITempMech extends Document {
  mechData: Partial<MechInterface>;
  otp: string;
  createdAt: Date;
  _id: Types.ObjectId;
}
