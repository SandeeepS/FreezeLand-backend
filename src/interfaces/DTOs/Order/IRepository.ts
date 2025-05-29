import mongoose, { ClientSession } from "mongoose";

export interface IOrderData {
  _id?: mongoose.Types.ObjectId 
  orderId: string| mongoose.Types.ObjectId ;
  mechanicId: string | mongoose.Types.ObjectId;
  complaintId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  serviceId: string | mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: boolean;
  adminCommission: number;
  mechanicEarning: number;
  isDeleted?: boolean;
  timestamp?: Date;
}

export interface IOrderDataResponse {
  status: string;
  message: string;
  data?: IOrderData ;
}




