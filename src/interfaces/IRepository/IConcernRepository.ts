import { getComplaintDetailsResponse, IAllComplaintDataResponse, IUpdateWorkDetails } from "../DTOs/Concern/IRepository";

export interface IConcernRepository {
    getComplaintDetails(id: string): Promise<getComplaintDetailsResponse[]>
    updateWorkDetails(data:IUpdateWorkDetails):Promise<unknown>
    getAllComplaints( page: number,limit: number,searchQuery: string,search: string): Promise<IAllComplaintDataResponse[] | null> 
    cancelComplaint(complaintId: string,userRole:string,reason: string): Promise<unknown>
}

export default IConcernRepository;