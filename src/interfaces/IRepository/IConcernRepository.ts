import { getComplaintDetailsResponse } from "../DTOs/Concern/IRepository";

export interface IConcernRepository {
    getComplaintDetails(
          id: string
        ): Promise<getComplaintDetailsResponse[]>
}

export default IConcernRepository;