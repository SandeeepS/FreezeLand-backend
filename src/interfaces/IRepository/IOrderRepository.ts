import { ClientSession } from "mongoose";
import {  IOrderData, IOrderDataResponse } from "../dataContracts/Order/IRepository";
export interface IOrderRepository {
checkPaymentExist(sessionId:string):Promise<boolean> 
createOrder(orderData: IOrderData, dbSession: ClientSession):Promise<IOrderDataResponse>
    
}

export default IOrderRepository;