import { getComplaintDetailsResponse, IUpdateWorkDetails } from "../DTOs/Concern/IRepository";

export interface IConcernRepository {
    getComplaintDetails(id: string): Promise<getComplaintDetailsResponse[]>
    updateWorkDetails(data:IUpdateWorkDetails):Promise<unknown>
}

export default IConcernRepository;