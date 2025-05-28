import Stripe from "stripe";
import IOrderService from "../interfaces/IServices/IOrderService";
import { IPaymentData } from "../interfaces/DTOs/User/IService.dto";
import IOrderRepository from "../interfaces/IRepository/IOrderRepository";
import { IAllOrderDataResponse } from "../interfaces/DTOs/Order/IService";
const frontendBaseUrl = process.env.FRONTEND_BASE_URL as string;
const stripeKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeKey);

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

class OrderServices implements IOrderService {
  constructor(private orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
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

  async createStripeSession(orderData: IPaymentData): Promise<unknown> {
    try {
      console.log("Reached orderService for purchasing order");
      console.log(orderData, "orderdatatata");

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
        success_url: `http://localhost:5173/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/user/payment/failed?complaintId{orderData.complaintId}`,
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

  async successPayment(sessionId: string): Promise<unknown> {
    console.log("entered in the successPayment  order service in the backend ");
    console.log(sessionId, "this is session 1");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    try {
      console.log(session, "this is session");

      if (session.payment_status == "paid" && session.metadata?.amount) {
        const purchasedAmount = parseInt(session.metadata?.amount);
        const { amount, complaintId, mechanicId, serviceId, status } =
          session.metadata;

        //generatiogn share for mechanic and admin
        const { adminCommission, mechanicEarning } =
          this.calculateCommissionAndEarning(purchasedAmount);
        console.log("Admin comission and mechanic Commission is",adminCommission,mechanicEarning);
        
        const order: OrderEventData = {
          orderId: session.id,
          userId: session.metadata?.userId,
          amount: purchasedAmount,
          complaintId: complaintId,
          mechanicId: mechanicId,
          serviceId: serviceId,
          paymentStatus: true,
          adminCommission: adminCommission,
          mechanicEarning: mechanicEarning,
          timestamp: new Date(),
        };

        console.log("firtsfirtstfirst");

        const response = await this.orderRepository.createOrder(order);
        if (response?.status === "SUCCESS") {
          console.log("triggered success");
          return {
            response,
          };
        } else {
          console.log("triggered fail");
          return {
            response,
          };
        }
      }
    } catch (error: any) {
      console.error("Payment processing failed:", error);
      return {
        success: false,
        message: "transaction failed",
        // data: session.metadata,
      };
    }
  }
}

export default OrderServices;
