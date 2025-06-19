import {
  GetAllDevicesResponse,
  IGetAllDevices,
  IGetDeviceCount,
} from "../dataContracts/Device/IRepository.dto";

export interface IDeviceRepository {
  getAllDevices(data: IGetAllDevices): Promise<GetAllDevicesResponse[] | null>;
  getDeviceCount(data: IGetDeviceCount): Promise<number>;
}
