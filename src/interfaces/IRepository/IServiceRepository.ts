import {
  GetAllServiceResponse,
  IGetAllServices,
  GetServiceCountDTO,
  IGetService,
  GetServiceResponse,
} from "../DTOs/Service/IRepository.dto";

export interface IServiceRepository {
  getService(data: IGetService): Promise<GetServiceResponse | null>;
  getAllServices(data: IGetAllServices): Promise<GetAllServiceResponse[] | null> 
  getServiceCount(data: GetServiceCountDTO): Promise<number>
}


