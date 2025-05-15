import { GetAllMechanicCompletedServicesResponse, GetAllUserRegisteredServicesResponse } from "../DTOs/Concern/IRepository";
import { getComplaintDetailsResponse, IAllComplaintDataResponse } from "../DTOs/Concern/IService";

export interface IConcernService {
     getAllComplaints(page:number,limit:number,searchQuery:string,search:string): Promise<IAllComplaintDataResponse[] | null>
     getComplaintById(complaintId: string): Promise<getComplaintDetailsResponse[]  | null>
     cancelComplaint(complaintId: string,userRole : string,reason:string) :Promise<unknown>
     getAllUserRegisteredServices(page: number,limit: number, searchQuery: string): Promise<GetAllUserRegisteredServicesResponse[] | null> 
     getAllCompletedServiceByMechanic(mechanicId:string):Promise<GetAllMechanicCompletedServicesResponse[] | null>
}

export default IConcernService;