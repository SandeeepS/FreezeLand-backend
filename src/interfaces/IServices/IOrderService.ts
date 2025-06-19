import { IAllOrderDataResponse, IOrderDataResponse, IPaymentData } from "../dataContracts/Order/IService";

export interface IOrderService {
   createStripeSession(orderData: IPaymentData):Promise<unknown>
   successPayment(sessionId: string):Promise<IOrderDataResponse | null>
}

export default IOrderService;