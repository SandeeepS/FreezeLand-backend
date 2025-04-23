import {
  GetAllServiceResponse,
  GetAllServicesDTO,
  GetServiceCountDTO,
  GetServiceDTO,
  GetServiceResponse,
} from "../DTOs/Service/IRepository.dto";

export interface IServiceRepository {
  getService(data: GetServiceDTO): Promise<GetServiceResponse | null>;
  getAllServices(data: GetAllServicesDTO): Promise<GetAllServiceResponse[] | null> 
  getServiceCount(data: GetServiceCountDTO): Promise<number>
}


