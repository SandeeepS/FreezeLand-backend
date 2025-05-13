import mongoose from "mongoose";

export interface IOrderData {
  orderId: string;
  mechanicId: string | mongoose.Types.ObjectId;
  complaintId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  serviceId: string | mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: boolean;
  isDeleted?: boolean;
  timestamp: Date;
}

export interface IOrderDataResponse {
  status: string;
  message: string;
  data: IOrderData | null;
}
