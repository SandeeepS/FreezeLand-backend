import {
  GetAllDevicesResponse,
  IGetAllDevices,
  IGetDeviceCount,
} from "../interfaces/dataContracts/Device/IRepository.dto";
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
    data: IGetAllDevices
  ): Promise<GetAllDevicesResponse[] | null> {
    try {
      const { page, limit } = data;
      // const regex = new RegExp(search.trim(), "i");
      const result = await deviceModel
        .find({
          isDeleted: false,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password")
        .exec();
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getDeviceCount(data: IGetDeviceCount): Promise<number> {
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
