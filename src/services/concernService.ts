import {
  GetAllMechanicCompletedServicesResponse,
  GetAllUserRegisteredServicesResponse,
} from "../interfaces/dataContracts/Concern/IRepository";
import {
  getComplaintDetailsResponse,
  IAllComplaintDataResponse,
  UpdatedcomplaintWithOrderIdResponse,
} from "../interfaces/dataContracts/Concern/IService";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IConcernService from "../interfaces/IServices/IConcernService";

class ConcernService implements IConcernService {
  constructor(private _concernRepositroy: IConcernRepository) {
    this._concernRepositroy = _concernRepositroy;
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
      const response = await this._concernRepositroy.getAllComplaints(
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
      const response = await this._concernRepositroy.getComplaintDetails(
        complaintId
      );
      return response;
    } catch (error) {
      console.error("Error fetching complaint by ID:", error);
      throw error;
    }
  }

  //function to cancel the complaint
  async cancelComplaint(
    complaintId: string,
    userRole: string,
    reason: string
  ): Promise<unknown> {
    try {
      console.log("Entered in the cancelComplaint in the concern service");
      const result = await this._concernRepositroy.cancelComplaint(
        complaintId,
        userRole,
        reason
      );
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getAllUserRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const data = await this._concernRepositroy.getAllUserRegisteredServices({
        page,
        limit,
        searchQuery,
      });
      console.log("data in the mechService ", data);

      return data;
    } catch (error) {
      console.log(
        "Error occured while fetching the user registerd complaint in the mechService ",
        error as Error
      );
      throw error;
    }
  }

  //function to get completed service/complait completed by mechanic
  async getAllCompletedServiceByMechanic(
    mechanicId: string
  ): Promise<GetAllMechanicCompletedServicesResponse[] | null> {
    try {
      console.log("Entered in the concern Service", mechanicId);
      const result =
        await this._concernRepositroy.getAllCompletedServiceByMechanic(
          mechanicId
        );
      return result;
    } catch (error) {
      console.log("Error occured while getting the  ");
      throw error;
    }
  }

  //function to update the orderid in the concern data base after payment optoin
  async updateConcernWithOrderId(
    complaintId: string,
    orderId: string
  ): Promise<UpdatedcomplaintWithOrderIdResponse | null> {
    try {
      console.log("Entered in the updatedConcernOrderId");
      const result = await this._concernRepositroy.updateConcernWithOrderId(
        complaintId,
        orderId
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured in the updateconcernWithOrderId in concernRepository",
        error
      );
      throw error;
    }
  }
}

export default ConcernService;
