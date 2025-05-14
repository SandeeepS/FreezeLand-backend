import { IAllComplaintDataResponse } from "../DTOs/Concern/IService";

export interface IConcernService {
     getAllComplaints(page:number,limit:number,searchQuery:string,search:string): Promise<IAllComplaintDataResponse[] | null>
}

export default IConcernService;