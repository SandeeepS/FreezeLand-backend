import mongoose, { Types, Document } from "mongoose";

export interface Address {
     fullAddress:string;
     houseNumber:string;
     longitude:number;
     latitude:number;
     landmark:string;
     isDeleted:boolean;
     isDefaultAddress:boolean;
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
