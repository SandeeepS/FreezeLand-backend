import mongoose from "mongoose";

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: number;
  addresses: {
    id: number;
    address: {
      name: string;
      phone: number;
      email: string;
      state: string;
      pin: number;
      district: string;
      landMark: string;
    };
  }[];
  isDeleted:boolean;
}
