import {
  GetAllDevicesDTO,
  GetAllDevicesResponse,
  GetDeviceCountDTO,
} from "../interfaces/DTOs/Device/IRepository.dto";
import { IDeviceRepository } from "../interfaces/IRepository/IDeviceRepository";
import deviceModel, { IDevice } from "../models/deviceModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class DeviceRepository
  extends BaseRepository<IDevice>
  implements IDeviceRepository
{
  constructor() {
    super(deviceModel);
  }
  async getAllDevices(
    data: GetAllDevicesDTO
  ): Promise<GetAllDevicesResponse[] | null> {
    try {
      const { page, limit, searchQuery, search } = data;
      const regex = new RegExp(search, "i");
      const result = await this.findAll(page, limit, regex);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getDeviceCount(data: GetDeviceCountDTO): Promise<number> {
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

export default DeviceRepository;
