import { IOrderData, IOrderDataResponse } from "../DTOs/Order/IRepository";
import { IOrder } from "../Model/IOrder";

export interface IOrderRepository {
createOrder(orderData: IOrderData): Promise<IOrderDataResponse | null>
}

export default IOrderRepository;