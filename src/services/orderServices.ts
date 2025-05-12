import Stripe from "stripe";
import IOrderService from "../interfaces/IServices/IOrderService";
import { IPaymentData } from "../interfaces/DTOs/User/IService.dto";
const frontendBaseUrl = process.env.FRONTEND_BASE_URL as string;
const stripeKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeKey);
class OrderServices implements IOrderService {
  constructor() {}

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
    console.log(sessionId, "this is session 1");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    try {
      console.log(session, "this is session");

      // if (session.payment_status === "paid" && session.metadata?.price) {
      //   const purchasedAmount = parseInt(session.metadata?.price);
      //   const { tutorId, courseId, userId } = session.metadata;
      //   // const transactionId = generateTransactionId(tutorId, courseId, userId);
      //   const shareForTutor = (purchasedAmount * 0.95).toFixed(2);
      //   const shareForAdmin = purchasedAmount - parseInt(shareForTutor);
      //   const adminShare = shareForAdmin.toString();
      //   const tutorShare = shareForTutor.toString();
      //   console.log(tutorShare, adminShare, "///////////////////////");
      //   // Make a request to the Order Service to create the order
      //   const event: OrderEventData = {
      //     userId: session.metadata?.userId, // Example of extra value
      //     courseId: session.metadata?.courseId, // Another example
      //     tutorId: session.metadata?.tutorId,
      //     thumbnail: session.metadata?.thumbnail,
      //     title: session.metadata?.title,
      //     price: session.metadata?.price,
      //     adminShare,
      //     tutorShare,
      //     transactionId,
      //     paymentStatus: true,
      //     timestamp: new Date(),
      //     status: "SUCCESS",
      //   };

      //   console.log("firtsfirtstfirst");
      //   // const response = await kafkaConfig.handlePaymentTransaction(event);
      //   if (response.status === "SUCCESS") {
      //     console.log("triggered success");
      //     return {
      //       success: true,
      //       data: session.metadata,
      //       message: "Payment successful",
      //     };
      //   } else {
      //     console.log("triggered fail");
      //     return {
      //       success: false,
      //       message: "transaction failed",
      //       data: session.metadata,
      //     };
      //   }
      return {
        success: true,
      };
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
