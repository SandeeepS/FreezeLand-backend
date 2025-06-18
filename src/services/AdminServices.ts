import { STATUS_CODES } from "../constants/httpStatusCodes";
import { compareInterface } from "../utils/comparePassword";
import { ICreateJWT } from "../utils/generateToken";
import {
  IAddDevice,
  AddNewDeviceResponse,
  AddNewServiceResponse,
  IAddService,
  IAdminLogin,
  AdminLoginResponse,
  BlockDeviceResponse,
  IBlockMech,
  BlockMechResponse,
  IBlockService,
  BlockServiceResponse,
  IBlockUser,
  BlockUserResponse,
  IDeleteDevice,
  DeleteDeviceResponse,
  IDeleteMech,
  DeleteMechResponse,
  DeleteServiceResponse,
  IDeleteUser,
  DeleteUserResponse,
  EditExistServiceResponse,
  IGetDevice,
  GetDeviceResponse,
  IGetMechanicById,
  GetMechByIdResponse,
  GetMechList,
  GetMechListResponse,
  IGetPreSignedUrl,
  GetPreSignedUrlResponse,
  IGetService,
  GetServiceResponse,
  GetServiceResponse2,
  IGetServices,
  GetUserList,
  GetUserListResponse,
  IisDeviceExist,
  isDeviceExistResponse,
  IsServiceExistResponse,
  IUpdateApprove,
  UpdateApproveResponse,
  IBlockDevice,
  IDeleteService,
  IEditExistService,
} from "../interfaces/DTOs/Admin/IService.dto";
import { IAdminService } from "../interfaces/IServices/IAdminService";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import { LoginValidation } from "../utils/validator";
import { IAdminRepository } from "../interfaces/IRepository/IAdminRepository";
import { IUserRepository } from "../interfaces/IRepository/IUserRepository";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";
import { IServiceRepository } from "../interfaces/IRepository/IServiceRepository";
import { IDeviceRepository } from "../interfaces/IRepository/IDeviceRepository";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";

class adminService implements IAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private userRepository: IUserRepository,
    private mechRepository: IMechRepository,
    private serviceRepository: IServiceRepository,
    private deviceRepository: IDeviceRepository,
    private concernRepository: IConcernRepository,
    private encrypt: compareInterface,
    private createjwt: ICreateJWT
  ) {
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.mechRepository = mechRepository;
    this.serviceRepository = serviceRepository;
    this.deviceRepository = deviceRepository;
    this.concernRepository = concernRepository;
    this.encrypt = encrypt;
    this.createjwt = createjwt;
  }

  //function for admin login
  async adminLogin(data: IAdminLogin): Promise<AdminLoginResponse> {
    try {
      console.log("entered in the admin login");
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const admin = await this.adminRepository.isAdminExist({ email });
        if (admin?.id) {
          if (admin?.password === password) {
            console.log("passwrod from the admin side is ", admin.password);
            const token = this.createjwt.generateAccessToken(
              admin.id,
              admin.role
            );
            const refreshToken = this.createjwt.generateRefreshToken(admin.id);
            console.log("admin is exist", admin);

            const filteredAdminData = {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
            };

            return {
              status: STATUS_CODES.OK || 200,
              data: {
                success: true,
                message: "Authentication Successful !",
                data: filteredAdminData,
                adminId: admin.id,
                token: token,
                refresh_token: refreshToken,
              },
            };
          } else {
            console.log("Incorrted password");
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
              message: "Email not exist",
            },
          } as const;
        }
      } else {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          data: {
            success: false,
            message: "Email or password is incorrect",
          },
        } as const;
      }
    } catch (error) {
      console.log("error occured while login admin", error);
      throw error;
    }
  }

  async getUserList(data: GetUserList): Promise<GetUserListResponse> {
    try {
      let { page, limit, searchQuery } = data;
      const { search } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const users = await this.userRepository.getUserList({
        page,
        limit,
        searchQuery,
        search,
      });
      if (users) {
        const searchRegex = new RegExp(searchQuery, "i");
        const usersCount = await this.userRepository.getUserCount(searchRegex);
        return {
          status: STATUS_CODES.OK,
          data: { users, usersCount },
          message: "success",
        };
      } else {
        return {
          status: STATUS_CODES.NOT_FOUND,
          data: { users: [], usersCount: 0 },
          message: "No users found",
        };
      }
    } catch (error) {
      console.log("Error occured while gettin the userList", error);
      throw error;
    }
  }

  async getMechList(data: GetMechList): Promise<GetMechListResponse> {
    try {
      let { page, limit, searchQuery } = data;
      const { search } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const mechs = await this.mechRepository.getMechList({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("list of mechanics is ", mechs);
      const searchRegex = new RegExp(searchQuery, "i");
      const mechsCount = await this.mechRepository.getMechCount(searchRegex);
      return {
        status: STATUS_CODES.OK,
        data: { mechs, mechsCount },
        message: "success",
      };
    } catch (error) {
      console.log("Error occured getmechList,in the adminService", error);
      throw error;
    }
  }

  async getServices(data: IGetServices): Promise<GetServiceResponse | null> {
    try {
      let { page, limit, searchQuery } = data;
      const { search } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const services = await this.serviceRepository.getAllServices({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("list of services is ", services);
      const servicesCount = await this.serviceRepository.getServiceCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { services, servicesCount },
        message: "success",
      };
    } catch (error) {
      console.log("error occured in the getService", error);
      throw error;
    }
  }

  async getDevcies(data: IGetDevice): Promise<GetDeviceResponse> {
    try {
      let { page, limit, searchQuery } = data;
      const { search } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const devices = await this.deviceRepository.getAllDevices({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("list of device  is ", devices);
      const devicesCount = await this.deviceRepository.getDeviceCount({
        searchQuery,
      });
      return {
        status: STATUS_CODES.OK,
        data: { devices, devicesCount },
        message: "success",
      };
    } catch (error) {
      console.log("Error occured in the getDevice", error);
      throw error;
    }
  }

  async getService(data: IGetService): Promise<GetServiceResponse2 | null> {
    try {
      const { id } = data;
      console.log("reached the getService in the adminService");
      const result = await this.serviceRepository.getService({ id });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error occured in teh getService", error);
      throw error;
    }
  }

  async getMechanicById(
    data: IGetMechanicById
  ): Promise<GetMechByIdResponse | null> {
    try {
      const { id } = data;
      console.log("Reached the getMehanic in the adminservice");
      const result = await this.mechRepository.getMechById({ id });
      return result;
    } catch (error) {
      console.log(
        "Error occured in the getMechanicById, in the adminservice",
        error
      );
      throw error;
    }
  }

  async blockUser(data: IBlockUser): Promise<BlockUserResponse | null> {
    try {
      const { userId } = data;
      return await this.adminRepository.blockUser({ userId });
    } catch (error) {
      console.log("Error while blocking the user in the adminService ", error);
      throw error;
    }
  }

  async blockMech(data: IBlockMech): Promise<BlockMechResponse | null> {
    try {
      const { mechId } = data;
      return await this.adminRepository.blockMech({ mechId });
    } catch (error) {
      console.log("Error occured in the blockMech", error);
      throw error;
    }
  }

  async blockService(
    data: IBlockService
  ): Promise<BlockServiceResponse | null> {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockService({ _id });
    } catch (error) {
      console.log("Error occured while blocking in the adminService", error);
      throw error;
    }
  }

  async blockDevice(data: IBlockDevice): Promise<BlockDeviceResponse | null> {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockDevice({ _id });
    } catch (error) {
      console.log(
        "error while blocking the device from the adminService",
        error
      );
      throw error;
    }
  }

  async deleteUser(data: IDeleteUser): Promise<DeleteUserResponse | null> {
    try {
      const { userId } = data;
      return await this.adminRepository.deleteUser({ userId });
    } catch (error) {
      console.log(
        "Error occured while deleting the user in the admin service",
        error
      );
      throw error;
    }
  }

  async deleteMech(data: IDeleteMech): Promise<DeleteMechResponse | null> {
    try {
      const { mechId } = data;
      return await this.adminRepository.deleteMech({ mechId });
    } catch (error) {
      console.log(
        "Error while deleting the mechanic from the adminService ",
        error
      );
      throw error;
    }
  }

  async deleteService(
    data: IDeleteService
  ): Promise<DeleteServiceResponse | null> {
    try {
      const { serviceId } = data;
      return await this.adminRepository.deleteService({ serviceId });
    } catch (error) {
      console.log(
        "Error while deleting a service from the admin Services",
        error
      );
      throw error;
    }
  }

  async deleteDevice(
    data: IDeleteDevice
  ): Promise<DeleteDeviceResponse | null> {
    try {
      const { deviceId } = data;
      return await this.adminRepository.deleteDevice({ deviceId });
    } catch (error) {
      console.log("Error while deleteDevice from the adminService");
      throw error;
    }
  }

  async isServiceExist(name: string): Promise<IsServiceExistResponse | null> {
    try {
      console.log("name in the adminServie ", name);
      return await this.adminRepository.isServiceExist({ name });
    } catch (error) {
      console.log(
        "error while checking isServiceExist or not  in the adminService",
        error
      );
      throw error;
    }
  }

  async addService(data: IAddService): Promise<AddNewServiceResponse | null> {
    try {
      const { values } = data;
      console.log("values from the service is ", values);
      return await this.adminRepository.addNewServices({ values });
    } catch (error) {
      console.log(
        "Error while adding new Services in the adminService ",
        error
      );
      throw error;
    }
  }

  //adding new devices
  async addDevice(data: IAddDevice): Promise<AddNewDeviceResponse | null> {
    try {
      const { name } = data;
      console.log("name in the addDevice in the adminService is", name);
      return await this.adminRepository.addNewDevice({ name });
    } catch (error) {
      console.log("Error while adding new Device form the adminService", error);
      throw error;
    }
  }

  //checking for the divce is existing or not for avoding the duplication
  async isDeviceExist(
    data: IisDeviceExist
  ): Promise<isDeviceExistResponse | null> {
    try {
      const { name } = data;
      return await this.adminRepository.isDeviceExist({ name });
    } catch (error) {
      console.log(
        "error while checking the isDeviceExist in the adminService",
        error
      );
      throw error;
    }
  }

  async editExistingService(
    data: IEditExistService
  ): Promise<EditExistServiceResponse | null> {
    try {
      const { _id, values } = data;
      return await this.adminRepository.editExistService({ _id, values });
    } catch (error) {
      console.log("error while editExistingService in AdminService", error);
      throw error;
    }
  }

  async updateApprove(
    data: IUpdateApprove
  ): Promise<UpdateApproveResponse | null> {
    try {
      const { id, verificationStatus } = data;
      let modifiedVerificationStatus;
      if (verificationStatus == "false") {
        modifiedVerificationStatus = true;
      } else {
        modifiedVerificationStatus = false;
      }
      if (id) {
        const result = await this.adminRepository.updateApprove({
          id,
          modifiedVerificationStatus,
        });
        return result;
      }
      return { result: false };
    } catch (error) {
      console.log(
        "Error while approving the mechanic in the AdminSerivce",
        error
      );
      throw error;
    }
  }

  //changing this generating presinged url code ot differtnt comon place
  async getPresignedUrl(data: IGetPreSignedUrl) {
    try {
      const { fileName, fileType, folderName } = data;
      if (!fileName || !fileType) {
        return {
          success: false,
          message: "File name and type are required",
        } as GetPreSignedUrlResponse;
      }
      const result = await generatePresignedUrl(fileName, fileType, folderName);
      return result as GetPreSignedUrlResponse;
    } catch (error) {
      console.log("Error in the getPresignedUrl in the admin Service", error);
      throw error;
    }
  }

  //function to get the all complaints
  async getAllComplaints(
    page: number,
    limit: number,
    searchQuery: string,
    search: string
  ): Promise<unknown> {
    try {
      console.log("reached the getAllComplaints in the adminService");
      console.log("Search in the admin service is ", search);
      const complaints = await this.concernRepository.getAllComplaints(
        page,
        limit,
        searchQuery,
        search
      );
      if (complaints) {
        return {
          status: STATUS_CODES.OK,
          data: { complaints },
          message: "success",
        };
      } else {
        return {
          status: STATUS_CODES.NOT_FOUND,
          data: { complaints: [] },
          message: "No complaints found",
        };
      }
    } catch (error) {
      console.log(
        "Error occured while getting all complaint in the admin service",
        error
      );
      throw error;
    }
  }

  //function to get the complaint by id
  async getComplaintById(id: string): Promise<unknown> {
    try {
      console.log("reached the getComplaintById in the adminService");
      const complaint = await this.concernRepository.getComplaintDetails(id);
      if (complaint) {
        return {
          status: STATUS_CODES.OK,
          data: { complaint },
          message: "success",
        };
      } else {
        return {
          status: STATUS_CODES.NOT_FOUND,
          data: { complaint: [] },
          message: "No complaints found",
        };
      }
    } catch (error) {
      console.log("Error occured in the getCompliantById", error);
      throw error;
    }
  }

  //function to cancel the complaint by admin
  async cancelComplaint(
    complaintId: string,
    userRole: string,
    reason: string
  ): Promise<unknown> {
    try {
      console.log(
        "reached in the cancel complaint function in the admin service",
        complaintId,
        userRole
      );
      const result = await this.concernRepository.cancelComplaint(
        complaintId,
        userRole,
        reason
      );
      return result;
    } catch (error) {
      console.log(
        "error ocured in the cancel complaint in the adminService",
        error
      );
      throw error;
    }
  }
}
export default adminService;
