import mongoose, { Model, Schema } from "mongoose";
import { IOrder } from "../interfaces/Model/IOrder";

const OrderSchema: Schema = new Schema({
  orderId: String,
  userId: { type: mongoose.Types.ObjectId, required: true },
  mechanicId: { type: mongoose.Types.ObjectId, required: true },
  serviceId: { type: mongoose.Types.ObjectId, required: true },
  complaintId: { type: mongoose.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false ,required:false},
  timestamp: { type: Date, default: Date.now },
});

const orderModel: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default orderModel;
