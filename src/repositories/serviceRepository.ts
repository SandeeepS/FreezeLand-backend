//this repository is used to handle the operaions to the service database . that means the services provided by the website

import {
  GetAllServiceResponse,
  GetAllServicesDTO,
  GetServiceCountDTO,
  GetServiceDTO,
  GetServiceResponse,
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

  async getService(data: GetServiceDTO): Promise<GetServiceResponse | null> {
    try {
      const { id } = data;
      console.log("entered in the getService in the ServiceRepository ");
      const result = await this.findById(id);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async getAllServices(
    data: GetAllServicesDTO
  ): Promise<GetAllServiceResponse[] | null> {
    try {
      const { page, limit, searchQuery, search } = data;
      const regex = new RegExp(search, "i");
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

  async getServiceCount(data: GetServiceCountDTO): Promise<number> {
    try {
      const { searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }
}

export default ServiceRepository;
