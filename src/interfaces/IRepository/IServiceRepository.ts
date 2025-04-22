import {
  GetServiceDTO,
  GetServiceResponse,
} from "../DTOs/Service/IRepository.dto";

export interface IServiceRepository {
  getService(data: GetServiceDTO): Promise<GetServiceResponse | null>;
}
