//this repository is used to handle the operaions to the service database . that means the services provided by the website

import {
  GetAllServiceResponse,
  IGetAllServices,
  IGetService,
  GetServiceResponse,
  IGetServiceCount,
} from "../interfaces/DTOs/Service/IRepository.dto";
import { IServiceRepository } from "../interfaces/IRepository/IServiceRepository";
import { IServices } from "../interfaces/Model/IService";
import serviceModel from "../models/serviceModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class ServiceRepository
  extends BaseRepository<IServices>
  implements IServiceRepository
{
  constructor() {
    super(serviceModel);
  }

  async getService(data: IGetService): Promise<GetServiceResponse | null> {
    try {
      const { id } = data;
      console.log("entered in the getService in the ServiceRepository and id ",id);
      const result = await this.findById(id);
      console.log("service details is ",result);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async getAllServices(
    data: IGetAllServices
  ): Promise<GetAllServiceResponse[] | null> {
    try {
      const { page, limit, search } = data;
      const regex = new RegExp(search.trim(), "i");
      const result = await this.findAll(page, limit, regex);
      console.log(
        "result in the getAllService in the serviceRepositroy",
        result
      );
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getServiceCount(data: IGetServiceCount): Promise<number> {
    try {
      const { searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

    async addService(serviceData: Partial<IServices>): Promise<IServices | null> {
    try {
      console.log("Adding new service with data:", serviceData);
      const result = await this.save(serviceData);
      console.log("Service added successfully:", result);
      return result;
    } catch (error) {
      console.log("Error adding service in ServiceRepository:", error as Error);
      throw new Error("Failed to add service");
    }
  }
}

export default ServiceRepository;
