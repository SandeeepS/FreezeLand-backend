import { comService } from "./comServices";
import AdminRepository from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { AdminAuthResponse } from "../interfaces/serviceInterfaces/InaAdminService";
import {
  AddDeviceDTO,
  AddserviceDTO,
  AdminLoginDTO,
  AdminLoginResponse,
  BlockDeviceDTO,
  BlockMechDTO,
  BlockServiceDTO,
  BlockUserDTO,
  DeleteDeviceDTO,
  DeleteMechDTO,
  DeleteServiceDTO,
  DeleteUserDTO,
  EditExistServiceDTO,
  GetDeviceDTO,
  GetDeviceResponse,
  GetMechList,
  GetMechListResponse,
  GetServiceDTO,
  GetServiceResponse,
  GetServicesDTO,
  GetUserList,
  GetUserListResponse,
  isDeviceExistDTO,
  IsServiceExistDTO,
} from "../interfaces/DTOs/Admin/IService.dto";

class adminService implements comService<AdminAuthResponse> {
  constructor(
    private adminRepository: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) {}

  async adminLogin(data: AdminLoginDTO): Promise<AdminLoginResponse> {
    try {
      console.log("entered in the admin login");
      const { email, password } = data;
      const admin = await this.adminRepository.isAdminExist({ email });
      if (admin?.id) {
        if (admin?.password === password) {
          console.log("passwrod from the admin side is ", admin.password);
          const token = this.createjwt.generateToken(admin.id);
          const refreshToken = this.createjwt.generateRefreshToken(admin.id);
          console.log("admin is exist", admin);
          return {
            status: STATUS_CODES.OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: admin,
              adminId: admin.id,
              token: token,
              refresh_token: refreshToken,
            },
          };
        } else {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            data: {
              success: false,
              message: "Incorrect password!",
            },
          } as const;
        }
      } else {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          data: {
            success: false,
            message: "Authentication failed",
          },
        } as const;
      }
    } catch (error) {
      console.log("error occured while login admin");
      throw error;
    }
  }

  async getUserList(data: GetUserList): Promise<GetUserListResponse> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const users = await this.adminRepository.getUserList({
        page,
        limit,
        searchQuery,
      });
      const usersCount = await this.adminRepository.getUserCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { users, usersCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  async getMechList(data: GetMechList): Promise<GetMechListResponse> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const mechs = await this.adminRepository.getMechList({
        page,
        limit,
        searchQuery,
      });
      console.log("list of mechanics is ", mechs);
      const mechsCount = await this.adminRepository.getMechCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { mechs, mechsCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  async getServices(data: GetServicesDTO): Promise<GetServiceResponse | null> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const services = await this.adminRepository.getAllServices({
        page,
        limit,
        searchQuery,
      });
      console.log("list of services is ", services);
      const servicesCount = await this.adminRepository.getServiceCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { services, servicesCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  async getDevcies(data: GetDeviceDTO): Promise<GetDeviceResponse> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const devices = await this.adminRepository.getAllDevices({
        page,
        limit,
        searchQuery,
      });
      console.log("list of device  is ", devices);
      const devicesCount = await this.adminRepository.getDeviceCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { devices, devicesCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  async getService(data: GetServiceDTO) {
    try {
      const { id } = data;
      console.log("reached the getService in the adminService");
      const result = await this.adminRepository.getService({ id });
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }
  async blockUser(data: BlockUserDTO) {
    try {
      const { userId } = data;
      return await this.adminRepository.blockUser({ userId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async blockMech(data: BlockMechDTO) {
    try {
      const { mechId } = data;
      return await this.adminRepository.blockMech({ mechId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async blockService(data: BlockServiceDTO) {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockService({ _id });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async blockDevice(data: BlockDeviceDTO) {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockDevice({ _id });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteUser(data: DeleteUserDTO) {
    try {
      const { userId } = data;
      return await this.adminRepository.deleteUser({ userId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteMech(data: DeleteMechDTO) {
    try {
      const { mechId } = data;
      return await this.adminRepository.deleteMech({ mechId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteService(data: DeleteServiceDTO) {
    try {
      const { serviceId } = data;
      return await this.adminRepository.deleteService({ serviceId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteDevice(data: DeleteDeviceDTO) {
    try {
      const { deviceId } = data;
      return await this.adminRepository.deleteDevice({ deviceId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async isServiceExist(data: IsServiceExistDTO) {
    try {
      const { name } = data;
      return await this.adminRepository.isServiceExist({ name });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async addService(data: AddserviceDTO) {
    try {
      const { values } = data;
      return await this.adminRepository.addNewServices({ values });
    } catch (error) {
      console.log(error as Error);
    }
  }

  //adding new devices
  async addDevice(data: AddDeviceDTO) {
    try {
      const { name } = data;
      return await this.adminRepository.addNewDevice({ name });
    } catch (error) {
      console.log(error as Error);
    }
  }

  //checking for the divce is existing or not for avoding the duplication
  async isDeviceExist(data: isDeviceExistDTO) {
    try {
      const { name } = data;
      return await this.adminRepository.isDeviceExist({ name });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async editExistingService(data: EditExistServiceDTO) {
    try {
      const { _id, values } = data;
      return await this.adminRepository.editExistService({ _id, values });
    } catch (error) {
      console.log(error as Error);
      throw error as Error;
    }
  }
}
export default adminService;
