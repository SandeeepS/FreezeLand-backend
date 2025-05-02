import mongoose ,{Types,Document} from "mongoose";

export interface MechInterface extends Document{
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  mechanicType: string[];
  photo: string;
  adharProof: string;
  employeeLicense: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ITempMech extends Document {
    mechData:Partial<MechInterface>;
    otp:string;
    createdAt:Date;
    _id:Types.ObjectId;
}