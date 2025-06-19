import {
  GetAllServiceResponse,
  IGetAllServices,
  IGetService,
  GetServiceResponse,
  IGetServiceCount,
} from "../dataContracts/Service/IRepository.dto";

export interface IServiceRepository {
  getService(data: IGetService): Promise<GetServiceResponse | null>;
  getAllServices(data: IGetAllServices): Promise<GetAllServiceResponse[] | null> 
  getServiceCount(data: IGetServiceCount): Promise<number>
}


