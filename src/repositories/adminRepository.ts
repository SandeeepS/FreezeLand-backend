import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { Document } from "mongoose";
import { BaseRepository } from "./BaseRepository/baseRepository";
import serviceModel, { IServices } from "../models/serviceModel";
import { MechInterface } from "../models/mechModel";
import UserRepository from "./userRepository";
import MechRepository from "./mechRepository";
import deviceModel, { IDevice } from "../models/deviceModel";
import {
  AddNewDeviceDTO,
  AddNewService,
  AddNewServiceDTO,
  BlockDeviceDTO,
  BlockMechDTO,
  BlockServiceDTO,
  BlockUserDTO,
  DeleteDeviceDTO,
  DeleteMechDTO,
  DeleteServiceDTO,
  DeleteUserDTO,
  EditExistServiceDTO,
  GetAdminByIdDTO,
  GetAdminByIdResponse,
  GetAllDevicesDTO,
  GetAllDevicesResponse,
  GetAllServiceResponse,
  GetAllServicesDTO,
  GetDeviceCountDTO,
  GetMechCountDTO,
  GetMechListDTO,
  GetMechListResponse,
  GetServiceCountDTO,
  GetServiceDTO,
  GetUserCountDTO,
  GetUserListDTO,
  GetUserListResponse,
  IsAdminExistDTO,
  IsAdminExistResponse,
  IsServiceExistDTO,
} from "../interfaces/DTOs/Admin/IRepository.dto";
import { isDeviceExistDTO } from "../interfaces/DTOs/Admin/IService.dto";

class AdminRepository extends BaseRepository<AdminInterface & Document> {
  private userRepository: UserRepository;
  private mechRepository: MechRepository;
  private serviceRepository: BaseRepository<IServices>;
  private deviceRepository: BaseRepository<IDevice>;
  constructor() {
    super(AdminModel);
    this.userRepository = new UserRepository();
    this.mechRepository = new MechRepository();
    this.serviceRepository = new BaseRepository<IServices>(serviceModel);
    this.deviceRepository = new BaseRepository<IDevice>(deviceModel);
  }
  async getAdminById(
    data: GetAdminByIdDTO
  ): Promise<GetAdminByIdResponse | null> {
    try {
      const { id } = data;
      const admin = await this.findById(id);
      return admin;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async isAdminExist(
    data: IsAdminExistDTO
  ): Promise<IsAdminExistResponse | null> {
    try {
      const { email } = data;
      console.log("enterd in the isAdminExist", email);
      const admin = await this.findOne({ email: email });
      if (admin) {
        console.log("admin is exist in the database !dlkghdopgokdgdgj");
        return admin as AdminInterface;
      } else {
        console.log("admin is not exists");
        return null;
      }
    } catch (error) {
      console.log("error occured in the isAmdinExist in the admin repository");
      throw error;
    }
  }

  async getUserList(
    data: GetUserListDTO
  ): Promise<GetUserListResponse[] | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const result = await this.userRepository.findAll(page, limit, regex);
      console.log("users list is ", result);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getMechList(data: GetMechListDTO): Promise<GetMechListResponse[]> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const result = await this.mechRepository.getMechList(page, limit, regex);
      return result as MechInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getAllServices(
    data: GetAllServicesDTO
  ): Promise<GetAllServiceResponse[] | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const result = await this.serviceRepository.findAll(page, limit, regex);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getAllDevices(
    data: GetAllDevicesDTO
  ): Promise<GetAllDevicesResponse[] | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const result = await this.deviceRepository.findAll(page, limit, regex);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getUserCount(data:GetUserCountDTO): Promise<number> {
    try {
      const {searchQuery} = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.userRepository.getUserCount(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getService(data:GetServiceDTO) {
    try {
      const {id} = data;
      console.log("entered in the getService in the adminRepository");
      const result = await this.serviceRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async editExistService(data:EditExistServiceDTO) {
    try {
      const {_id,values } = data;
      const editedService = await this.serviceRepository.update(_id, values);
      return editedService;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async blockUser(data:BlockUserDTO) {
    try {
      const {userId} = data;
      const user = await this.userRepository.findById(userId);
      if (user) {
        user.isBlocked = !user?.isBlocked;
        await user.save();
        return user;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async blockMech(data:BlockMechDTO) {
    try {
      const {mechId} = data;
      const mech = await this.mechRepository.getMechById(mechId);
      if (mech) {
        mech.isBlocked = !mech?.isBlocked;
        await this.mechRepository.saveMechanic(mech);
        return mech;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async BlockService(data:BlockServiceDTO) {
    try {
      const {_id} = data;
      const service = await this.serviceRepository.findById(_id);
      if (service) {
        service.isBlocked = !service?.isBlocked;
        await this.serviceRepository.save(service);
        return service;
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async BlockDevice(data:BlockDeviceDTO) {
    try {
      const {_id} = data;
      const service = await this.deviceRepository.findById(_id);
      if (service) {
        service.isBlocked = !service?.isBlocked;
        await this.deviceRepository.save(service);
        return service;
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteUser(data:DeleteUserDTO) {
    try {
      const {userId} = data
      const user = await this.userRepository.findById(userId);
      if (user) {
        user.isDeleted = !user?.isDeleted;
        await this.userRepository.saveUser(user);
        return user;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async deleteMech(data:DeleteMechDTO) {
    try {
      const {mechId} = data;
      const mech = await this.mechRepository.findById(mechId);
      if (mech) {
        mech.isDeleted = !mech?.isDeleted;
        await this.mechRepository.saveMechanic(mech);
        return mech;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async deleteService(data:DeleteServiceDTO) {
    try {
      const {serviceId} = data;
      const serivce = await this.serviceRepository.findById(serviceId);
      if (serivce) {
        serivce.isDeleted = !serivce?.isDeleted;
        await this.serviceRepository.save(serivce);
        return serivce;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async deleteDevice(data:DeleteDeviceDTO) {
    try {
      const {deviceId} = data;
      const device = await this.deviceRepository.findById(deviceId);
      if (device) {
        device.isDeleted = !device?.isDeleted;
        await this.deviceRepository.save(device);
        return device;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async isServiceExist(data:IsServiceExistDTO) {
    try {
      const {name} = data;
      const serviceExist = await this.serviceRepository.findOne({ name: name });
      if (serviceExist) {
        return serviceExist;
      }
      return false;
    } catch (error) {
      console.log(error as Error);
    }
  }

  async isDeviceExist(data:isDeviceExistDTO) {
    try {
      const {name } = data;
      const DeviceExist = await this.deviceRepository.findOne({ name: name });
      if (DeviceExist) {
        console.log("divice is exist 1111");
        return DeviceExist;
      }
      return false;
    } catch (error) {
      console.log(error as Error);
    }
  }

  async addNewServices(data:AddNewServiceDTO) {
    try {
      const {values} = data;
      const addedService = await this.serviceRepository.addService(values);
      if (addedService) {
        return addedService;
      } else {
        throw new Error("Something went wrong ");
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async addNewDevice(data:AddNewDeviceDTO) {
    try {
      const {name } = data;
      const addedDevice = await this.deviceRepository.addDevice(name);
      if (addedDevice) {
        return addedDevice;
      } else {
        throw new Error("Something went wrong ");
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async getMechCount(data:GetMechCountDTO): Promise<number> {
    try {
      const {searchQuery} = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.mechRepository.getMechCount(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getServiceCount(data:GetServiceCountDTO): Promise<number> {
    try {
      const {searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.serviceRepository.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getDeviceCount(data:GetDeviceCountDTO): Promise<number> {
    try {
      const {searchQuery} = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.deviceRepository.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }
}

export default AdminRepository;
