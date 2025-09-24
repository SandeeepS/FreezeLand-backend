import mongoose from "mongoose";

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  addressType: "Home" | "Work";
  fullAddress:string;
  houseNumber:string;
  longitude:number;
  latitude:number;
  landmark:string;
  isDeleted:boolean;
  isDefaultAddress:boolean;
}
