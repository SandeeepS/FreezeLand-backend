import {  IOrderData, IOrderDataResponse } from "../DTOs/Order/IRepository";
export interface IOrderRepository {

createOrder(orderData: IOrderData): Promise<IOrderDataResponse | null>
    
}

export default IOrderRepository;