import { GetAllMechanicCompletedServicesResponse, IGetAllUserRegisteredServices, GetAllUserRegisteredServicesResponse, getComplaintDetailsResponse, IAllComplaintDataResponse, IUpdateWorkDetails, UpdatedcomplaintWithOrderIdResponse } from "../dataContracts/Concern/IRepository";

export interface IConcernRepository {
    getComplaintDetails(id: string): Promise<getComplaintDetailsResponse[]>
    updateWorkDetails(data:IUpdateWorkDetails):Promise<unknown>
    getAllComplaints( page: number,limit: number,searchQuery: string,search: string): Promise<IAllComplaintDataResponse[] | null> 
    cancelComplaint(complaintId: string,userRole:string,reason: string): Promise<unknown>
    getAllUserRegisteredServices(data: IGetAllUserRegisteredServices): Promise<GetAllUserRegisteredServicesResponse[]|null> 
    getAllCompletedServiceByMechanic(mechanicId: string): Promise<GetAllMechanicCompletedServicesResponse[] | null> 
    updateConcernWithOrderId(complaintId:string, orderId:string):Promise<UpdatedcomplaintWithOrderIdResponse | null>
    
}

export default IConcernRepository;