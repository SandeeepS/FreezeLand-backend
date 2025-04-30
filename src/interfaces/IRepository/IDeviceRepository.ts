import {
  GetAllDevicesDTO,
  GetAllDevicesResponse,
  GetDeviceCountDTO,
} from "../DTOs/Device/IRepository.dto";

export interface IDeviceRepository {
  getAllDevices(data: GetAllDevicesDTO): Promise<GetAllDevicesResponse[] | null>;
  getDeviceCount(data: GetDeviceCountDTO): Promise<number>;
}
