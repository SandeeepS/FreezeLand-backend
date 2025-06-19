import mongoose from "mongoose";
import { IOrderData } from "./IRepository";

export interface IPaymentData {
  complaintId: string;
  status: string;
  mechanicId: string;
  amount: number;
  serviceId: string;
}

export interface IAllOrderDataResponse {
  orderId: string;
  mechanicId: mongoose.Types.ObjectId | string;
  complaintId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  serviceId: mongoose.Types.ObjectId  ;
  amount: number;
  paymentStatus: boolean;
  isDeleted: boolean;
  timestamp: Date;
}

export interface IOrderDataResponse {
  status: string;
  message: string;
  data?: IOrderData ;
}

