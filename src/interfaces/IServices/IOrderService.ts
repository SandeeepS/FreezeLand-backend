import { createStripSessionResponse } from "../dataContracts/Order/IRepository";
import {  IOrderDataResponse, IPaymentData } from "../dataContracts/Order/IService";

export interface IOrderService {
createStripeSession(orderData: IPaymentData): Promise<createStripSessionResponse>
successPayment(sessionId: string):Promise<IOrderDataResponse | null>
}

export default IOrderService;