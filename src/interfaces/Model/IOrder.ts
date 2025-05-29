import mongoose from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  mechanicId: mongoose.Types.ObjectId;
  complaintId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: boolean;
  adminCommission: number;
  mechanicEarning: number;
  isDeleted: boolean;
  timestamp: Date;
}


export interface IUpdateMechanicDetails{
  mechanicId:string;
  query:object;
}