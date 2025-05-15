import { getComplaintDetailsResponse, IAllComplaintDataResponse } from "../DTOs/Concern/IService";

export interface IConcernService {
     getAllComplaints(page:number,limit:number,searchQuery:string,search:string): Promise<IAllComplaintDataResponse[] | null>
     getComplaintById(complaintId: string): Promise<getComplaintDetailsResponse[]  | null>
     cancelComplaint(complaintId: string,userRole : string,reason:string) :Promise<unknown>
}

export default IConcernService;