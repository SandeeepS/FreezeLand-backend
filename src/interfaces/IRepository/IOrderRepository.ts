import { IAllOrderDataResponse, IOrderData, IOrderDataResponse } from "../DTOs/Order/IRepository";

export interface IOrderRepository {

createOrder(orderData: IOrderData): Promise<IOrderDataResponse | null>
getAllComplaints(page: number,limit: number,searchQuery: string,search:string): Promise<IAllOrderDataResponse[] | null>

}

export default IOrderRepository;