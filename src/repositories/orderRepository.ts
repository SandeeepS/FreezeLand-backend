import mongoose, { ClientSession } from "mongoose";
import {
  
  IOrderData,
  IOrderDataResponse,
} from "../interfaces/DTOs/Order/IRepository";
import IOrderRepository from "../interfaces/IRepository/IOrderRepository";
import { IOrder } from "../interfaces/Model/IOrder";
import orderModel from "../models/orderModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class OrderRepository
  extends BaseRepository<IOrder & Document>
  implements IOrderRepository
  
{
  constructor(){
    super(orderModel);
  }

  async createOrder(orderData: IOrderData, dbSession: ClientSession): Promise<IOrderDataResponse> {
    try {
      console.log(
        "entered in the create order method in the order repository",
        orderData
      );
      const {
        orderId,
        userId,
        mechanicId,
        serviceId,
        complaintId,
        amount,
        paymentStatus,
        adminCommission,
        mechanicEarning
      } = orderData;
      let objectMechId = new mongoose.Types.ObjectId(mechanicId);
      let objectCompId = new mongoose.Types.ObjectId(complaintId);
      let objectUserId = new mongoose.Types.ObjectId(userId);
      let objectServiceId = new mongoose.Types.ObjectId(serviceId);
      const dataToSave = {
        orderId: orderId,
        userId: objectUserId,
        mechanicId: objectMechId,
        serviceId: objectServiceId,
        complaintId: objectCompId,
        amount: amount,
        paymentStatus: paymentStatus,
        adminCommission:adminCommission,
        mechanicEarning:mechanicEarning
      };
      const savedOrder = await orderModel.create([dataToSave], { session: dbSession });
      console.log("saved order from the database is ", savedOrder);
      if (savedOrder && savedOrder.length > 0) {
        const orderDoc = savedOrder[0];
        const orderDataResponse: IOrderData = {
          _id:orderDoc._id,
          orderId: orderDoc.orderId,
          userId: orderDoc.userId,
          mechanicId: orderDoc.mechanicId,
          serviceId: orderDoc.serviceId,
          complaintId: orderDoc.complaintId,
          amount: orderDoc.amount,
          paymentStatus: orderDoc.paymentStatus,
          adminCommission: orderDoc.adminCommission,
          mechanicEarning: orderDoc.mechanicEarning
        };
        return {
          status: "SUCCESS",
          message: "Order created successfully",
          data: orderDataResponse,
        };
      } else {
        return {
          status: "FAILURE",
          message: "Order not created",
          
        };
      }
    } catch (error) {
      console.error("Error in repository while creating order:", error);
      throw error;
    }
  }


}

export default OrderRepository;
