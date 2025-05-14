import mongoose from "mongoose";
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

  async createOrder(orderData: IOrderData): Promise<IOrderDataResponse | null> {
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
      };
      const savedOrder = await this.save(dataToSave);
      console.log("saved order from the database is ", savedOrder);
      if (savedOrder) {
        return {
          status: "SUCCESS",
          message: "Order created successfully",
          data: savedOrder as IOrderData,
        };
      } else {
        return {
          status: "FAILURE",
          message: "Order not created",
          data: null,
        };
      }
    } catch (error) {
      console.error("Error in repository while creating order:", error);
      throw error;
    }
  }


}

export default OrderRepository;
