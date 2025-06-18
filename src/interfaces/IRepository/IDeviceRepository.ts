import {
  GetAllDevicesDTO,
  GetAllDevicesResponse,
  IGetDeviceCount,
} from "../DTOs/Device/IRepository.dto";

export interface IDeviceRepository {
  getAllDevices(data: GetAllDevicesDTO): Promise<GetAllDevicesResponse[] | null>;
  getDeviceCount(data: IGetDeviceCount): Promise<number>;
}
