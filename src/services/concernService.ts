import { getComplaintDetailsResponse, IAllComplaintDataResponse } from "../interfaces/DTOs/Concern/IService";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IConcernService from "../interfaces/IServices/IConcernService";

class ConcernService implements IConcernService {
  constructor(private concernRepositroy: IConcernRepository) {
    this.concernRepositroy = concernRepositroy;
  }

  async getAllComplaints(
    page: number,
    limit: number,
    searchQuery: string,
    search: string
  ): Promise<IAllComplaintDataResponse[] | null> {
    try {
      console.log(
        "entered in the get all complaints method in the concern service"
      );
      console.log("search in the concern service", search);
      const response = await this.concernRepositroy.getAllComplaints(
        page,
        limit,
        searchQuery,
        search
      );
      return response;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

  // function to get complaint by id
  async getComplaintById(
    complaintId: string
  ): Promise<getComplaintDetailsResponse[] | null> {
    try {
      console.log(
        "entered in the get complaint by id method in the concern service"
      );
      const response = await this.concernRepositroy.getComplaintDetails(
        complaintId
      );
      return response;
    } catch (error) {
      console.error("Error fetching complaint by ID:", error);
      throw error;
    }
  }

  //function to cancel the complaint 
  async cancelComplaint(complaintId: string,userRole : string,reason:string) :Promise<unknown>{
    try {
      console.log("Entered in the cancelComplaint in the concern service");
      const result = await this.concernRepositroy.cancelComplaint(complaintId,userRole,reason);
      return result;
    }catch(error){
      console.log(error as Error);
      throw error;
    }
  }
}

export default ConcernService;
