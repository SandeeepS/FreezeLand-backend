import { IAllOrderDataResponse, IPaymentData } from "../DTOs/Order/IService";

export interface IOrderService {
   createStripeSession(orderData: IPaymentData):Promise<unknown>
   successPayment(sessionId: string):Promise<unknown>
   getAllComplaints(page:number,limit:number,searchQuery:string,search:string): Promise<IAllOrderDataResponse[] | null> 
}

export default IOrderService;