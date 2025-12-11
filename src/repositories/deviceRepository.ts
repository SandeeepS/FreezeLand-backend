import {
  AddNewDeviceResponse,
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
      const { page, limit,search } = data;
      const regex = new RegExp(search.trim(), "i");
      const result = await deviceModel
        .find({
          isDeleted: false,
          name:regex
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
      return await deviceModel.countDocuments({
        $or: [{ name: { $regex: regex } }],
      });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getAllDevices2(): Promise<GetAllDevicesResponse[] | null> {
    try {
      const result = await deviceModel.find({
        isDeleted: false,
      });
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured ");
    }
  }

  async addDevice(name: string): Promise<AddNewDeviceResponse | null> {
    try {
      const newSerive = new deviceModel({ name: name });
      await newSerive.save();
      return newSerive;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default DeviceRepository;
