import { IPaymentData } from "../DTOs/Order/IService";

export interface IOrderService {
   createStripeSession(orderData: IPaymentData):Promise<unknown>
   successPayment(sessionId: string):Promise<unknown>
}

export default IOrderService;