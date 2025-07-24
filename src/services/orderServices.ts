import Stripe from "stripe";
import IOrderService from "../interfaces/IServices/IOrderService";
import { IPaymentData } from "../interfaces/dataContracts/User/IService.dto";
import IOrderRepository from "../interfaces/IRepository/IOrderRepository";
import {
  IOrderDataResponse,
} from "../interfaces/dataContracts/Order/IService";
import mongoose from "mongoose";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";
import { createStripSessionResponse } from "../interfaces/dataContracts/Order/IRepository";
const stripeKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeKey);
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL


export interface OrderEventData {
  orderId: string;
  amount: number;
  complaintId: string;
  mechanicId: string;
  serviceId: string;
  userId: string;
  paymentStatus: boolean;
  adminCommission: number;
  mechanicEarning: number;
  timestamp: Date;
}

class OrderServices implements IOrderService{
  constructor(
    private _orderRepository: IOrderRepository,
    private _mechRepository: IMechRepository
  ) {
    this._orderRepository = _orderRepository;
    this._mechRepository = _mechRepository;
  }

  private calculateCommissionAndEarning(totalAmount: number): {
    adminCommission: number;
    mechanicEarning: number;
  } {
    const adminCommissionRate = 0.05;
    const adminCommission = Math.round(totalAmount * adminCommissionRate);

    const mechanicEarning = totalAmount - adminCommission;

    console.log(`Commission Calculation:
      Total Amount: ₹${totalAmount}
      Admin Commission (5%): ₹${adminCommission}
      Mechanic Earning (95%): ₹${mechanicEarning}
    `);

    return {
      adminCommission,
      mechanicEarning,
    };
  }

  async createStripeSession(orderData: IPaymentData): Promise<createStripSessionResponse> {
    try {
      console.log("Reached orderService for purchasing order");
      console.log(orderData, "orderdatatata");
      console.log("frontend url is ",FRONTEND_BASE_URL);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Service Payment",
                description: "Payment for service",
              },
              unit_amount: orderData.amount * 100, // Assuming price is in dollars
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${FRONTEND_BASE_URL}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_BASE_URL}/user/payment/failed?complaintId{orderData.complaintId}`,
        metadata: {
          complaintId: orderData.complaintId,
          status: orderData.status,
          mechanicId: orderData.mechanicId,
          amount: orderData.amount,
          serviceId: orderData.serviceId,
        },
      });
      console.log("Session created successfully", session.id);
      return {
        success: true,
        message: "Order successfully created",
        sessionId: session.id,
      };
    } catch (error) {
      console.log("Error in completing the payment:", error);
      return { success: false, message: "Failed to create order." };
    }
  }

  //function to handle the sucess payment 
  async successPayment(sessionId: string): Promise<IOrderDataResponse | null> {
    console.log("Entered successPayment in OrderService.");
    console.log("Session ID:", sessionId);

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    try {
      console.log("Stripe session data:", stripeSession);

      if (
        stripeSession.payment_status === "paid" &&
        stripeSession.metadata?.amount
      ) {
        const purchasedAmount = parseInt(stripeSession.metadata.amount);
        const { complaintId, mechanicId, serviceId, } =
          stripeSession.metadata;

        // 1. Calculate commission
        const { adminCommission, mechanicEarning } =
          this.calculateCommissionAndEarning(purchasedAmount);
        console.log(
          "Admin Commission:",
          adminCommission,
          "Mechanic Earning:",
          mechanicEarning
        );

        // 2. Build the order object
        const order: OrderEventData = {
          orderId: stripeSession.id,
          userId: stripeSession.metadata.userId,
          amount: purchasedAmount,
          complaintId,
          mechanicId,
          serviceId,
          paymentStatus: true,
          adminCommission,
          mechanicEarning,
          timestamp: new Date(),
        };

        // Starting MongoDB session
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
          // Create Order (pass session)
          const orderResponse = await this._orderRepository.createOrder(
            order,
            dbSession
          );
          console.log("orderResponse in the orderSErvice is ",orderResponse);
          await this._mechRepository.updateMechanicEarnings({
            mechanicId,
            mechanicEarning,
            dbSession,
          });

          //  Commit transaction if everything went fine
          await dbSession.commitTransaction();
          dbSession.endSession();

          console.log("Transaction committed.");
          return {
            status: "SUCCESS",
            message: "Payment processed and mechanic updated successfully.",
            data: orderResponse.data,
          };
        } catch (dbError) {
          // Rollback transaction if any DB operation fails
          await dbSession.abortTransaction();
          dbSession.endSession();

          console.error("Transaction failed:", dbError);
          return {
            status: "FAILURE",
            message: "Database transaction failed.",
          };
        }
      }

      return {
        status: "FAILURE",
        message: "Invalid payment or metadata.",
      };
    } catch (error: unknown) {
      console.error("Stripe retrieval failed:", error);
      return {
        status: "FAILURE",
        message: "Stripe retrival Failed",
      };
    }
  }
}

export default OrderServices;
