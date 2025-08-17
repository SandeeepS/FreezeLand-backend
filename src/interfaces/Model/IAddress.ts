import mongoose from "mongoose";

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: number;
  email: string;
  state: string;
  pin: number;
  district: string;
  landMark: string;
}


