import { IAllComplaintDataResponse } from "../interfaces/DTOs/Concern/IService";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IConcernService from "../interfaces/IServices/IConcernService";

class ConcernService implements IConcernService {
    constructor(
        private concernRepositroy : IConcernRepository,
    ){
        this.concernRepositroy = concernRepositroy;

    }

      async getAllComplaints(page:number,limit:number,searchQuery:string,search:string): Promise<IAllComplaintDataResponse[] | null> {
    try {
      console.log("entered in the get all complaints method in the concern service");
      console.log("search in the concern service", search);
      const response = await this.concernRepositroy.getAllComplaints(page,limit,searchQuery,search);
      return response;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

}

export default ConcernService;