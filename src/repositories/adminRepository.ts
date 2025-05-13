import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { Document } from "mongoose";
import { BaseRepository } from "./BaseRepository/baseRepository";
import serviceModel from "../models/serviceModel";
import UserRepository from "./userRepository";
import MechRepository from "./mechRepository";
import deviceModel, { IDevice } from "../models/deviceModel";
import { IServices } from "../interfaces/Model/IService";
import {
  AddNewDeviceDTO,
  AddNewDeviceResponse,
  AddNewServiceDTO,
  AddNewServiceResponse,
  BlockDeviceDTO,
  BlockDeviceResponse,
  BlockMechDTO,
  BlockMechResponse,
  BlockServiceDTO,
  BlockServiceResponse,
  BlockUserDTO,
  BlockUserResponse,
  DeleteDeviceDTO,
  DeleteDeviceResponse,
  DeleteMechDTO,
  DeleteMechResponse,
  DeleteServiceDTO,
  DeleteServiceResponse,
  DeleteUserDTO,
  DeleteUserResponse,
  EditExistServiceDTO,
  EditExistServiceResponse,
  GetAdminByIdDTO,
  GetAdminByIdResponse,


  IsAdminExistDTO,
  IsAdminExistResponse,
  IsDeviceExistDTO,
  isDeviceExistResponse,
  IsServiceExistDTO,
  IsServiceExistResponse,
  UpdateApproveDTO,
  UpdateApproveResponse,
} from "../interfaces/DTOs/Admin/IRepository.dto";
import { IAdminRepository } from "../interfaces/IRepository/IAdminRepository";

class AdminRepository
  extends BaseRepository<AdminInterface & Document>
  implements IAdminRepository
{
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

  async updateApprove(
    data: UpdateApproveDTO
  ): Promise<UpdateApproveResponse | null> {
    try {
      const { id, modifiedVerificationStatus } = data;
      const qr = { isVerified: modifiedVerificationStatus };
      const result = await this.mechRepository.update(id, qr);
      if (result) {
        return { result: true };
      } else {
        return { result: false };
      }
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



  async editExistService(
    data: EditExistServiceDTO
  ): Promise<EditExistServiceResponse | null> {
    try {
      const { _id, values } = data;
      const editedService = await this.serviceRepository.update(_id, values);
      return editedService;
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "error occured while editExistService in adminRepository"
      );
    }
  }

  async blockUser(data: BlockUserDTO): Promise<BlockUserResponse | null> {
    try {
      const { userId } = data;
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

  async blockMech(data: BlockMechDTO): Promise<BlockMechResponse | null> {
    try {
      const { mechId } = data;
      const mech = await this.mechRepository.getMechById({ id: mechId });
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

  async BlockService(
    data: BlockServiceDTO
  ): Promise<BlockServiceResponse | null> {
    try {
      const { _id } = data;
      const service = await this.serviceRepository.findById(_id);
      if (service) {
        service.isBlocked = !service?.isBlocked;
        await this.serviceRepository.save(service);
        return service;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error while Blocking the service from the adminRepository"
      );
    }
  }

  async BlockDevice(data: BlockDeviceDTO): Promise<BlockDeviceResponse | null> {
    try {
      const { _id } = data;
      const service = await this.deviceRepository.findById(_id);
      if (service) {
        service.isBlocked = !service?.isBlocked;
        await this.deviceRepository.save(service);
        return service;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error("error while blocking device from the AdminRepository");
    }
  }

  async deleteUser(data: DeleteUserDTO): Promise<DeleteUserResponse | null> {
    try {
      const { userId } = data;
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

  async deleteMech(data: DeleteMechDTO): Promise<DeleteMechResponse | null> {
    try {
      const { mechId } = data;
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

  async deleteService(
    data: DeleteServiceDTO
  ): Promise<DeleteServiceResponse | null> {
    try {
      const { serviceId } = data;
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

  async deleteDevice(
    data: DeleteDeviceDTO
  ): Promise<DeleteDeviceResponse | null> {
    try {
      const { deviceId } = data;
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
      throw new Error(
        "Error while delelting the Device from the adminRepository"
      );
    }
  }

  async isServiceExist(
    data: IsServiceExistDTO
  ): Promise<IsServiceExistResponse | null> {
    try {
      const { name } = data;
      console.log("name in the admin Repository ", name);
      const serviceExist = await this.serviceRepository.findOne({ name });
      if (serviceExist) {
        return serviceExist;
      }
      return null;
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while checking isServiceExist in the adminRepository"
      );
    }
  }

  async isDeviceExist(
    data: IsDeviceExistDTO
  ): Promise<isDeviceExistResponse | null> {
    try {
      const { name } = data;
      const DeviceExist = await this.deviceRepository.findOne({ name: name });
      if (DeviceExist) {
        console.log("divice is exist 1111");
        return DeviceExist;
      }
      return null;
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "error while checking isDeviceExist in the adminRepository"
      );
    }
  }

  async addNewServices(
    data: AddNewServiceDTO
  ): Promise<AddNewServiceResponse | null> {
    try {
      const { values } = data;
      console.log("values from the serviceRepository is ", values);
      const addedService = await this.serviceRepository.addService(values);
      if (addedService) {
        return addedService;
      } else {
        throw new Error("Something went wrong ");
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while adding new Services from the adminService");
    }
  }

  async addNewDevice(
    data: AddNewDeviceDTO
  ): Promise<AddNewDeviceResponse | null> {
    try {
      const { name } = data;
      const addedDevice = await this.deviceRepository.addDevice(name);
      if (addedDevice) {
        return addedDevice;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while adding new device from the adminRepository");
    }
  }






}

export default AdminRepository;
