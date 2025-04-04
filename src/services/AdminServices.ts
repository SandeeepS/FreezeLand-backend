import { STATUS_CODES } from "../constants/httpStatusCodes";
import { compareInterface } from "../utils/comparePassword";
import { ICreateJWT } from "../utils/generateToken";
import {
  AddDeviceDTO,
  AddNewDeviceResponse,
  AddNewServiceResponse,
  AddserviceDTO,
  AdminLoginDTO,
  AdminLoginResponse,
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
  GetDeviceDTO,
  GetDeviceResponse,
  GetMechanicByIdDTO,
  GetMechanicByIdResponse,
  GetMechList,
  GetMechListResponse,
  GetPreSignedUrlDTO,
  GetPreSignedUrlResponse,
  GetServiceDTO,
  GetServiceResponse,
  GetServiceResponse2,
  GetServicesDTO,
  GetUserList,
  GetUserListResponse,
  isDeviceExistDTO,
  isDeviceExistResponse,
  IsServiceExistDTO,
  IsServiceExistResponse,
  UpdateApproveDTO,
  UpdateApproveResponse,
} from "../interfaces/DTOs/Admin/IService.dto";
import { IAdminService } from "../interfaces/IServices/IAdminService";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import { LoginValidation } from "../utils/validator";
import { IAdminRepository } from "../interfaces/IRepository/IAdminRepository";

class adminService implements IAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private encrypt: compareInterface,
    private createjwt: ICreateJWT
  ) {
    this.adminRepository = adminRepository;
    this.encrypt = encrypt;
    this.createjwt = createjwt;
  }

  async adminLogin(data: AdminLoginDTO): Promise<AdminLoginResponse> {
    try {
      console.log("entered in the admin login");
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const admin = await this.adminRepository.isAdminExist({ email });
        if (admin?.id) {
          if (admin?.password === password) {
            console.log("passwrod from the admin side is ", admin.password);
            const token = this.createjwt.generateToken(admin.id, admin.role);
            const refreshToken = this.createjwt.generateRefreshToken(admin.id);
            console.log("admin is exist", admin);
            return {
              status: STATUS_CODES.OK || 200,
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
      if (users) {
        const usersCount = await this.adminRepository.getUserCount({
          searchQuery,
        });

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

  async getService(data: GetServiceDTO): Promise<GetServiceResponse2 | null> {
    try {
      const { id } = data;
      console.log("reached the getService in the adminService");
      const result = await this.adminRepository.getService({ id });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async getMechanicById(
    data: GetMechanicByIdDTO
  ): Promise<GetMechanicByIdResponse | null> {
    try {
      const { id } = data;
      console.log("Reached the getMehanic in the adminservice");
      const result = await this.adminRepository.getMechanicById({ id });
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async blockUser(data: BlockUserDTO): Promise<BlockUserResponse | null> {
    try {
      const { userId } = data;
      return await this.adminRepository.blockUser({ userId });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured while blocking user in AdminService ");
    }
  }

  async blockMech(data: BlockMechDTO): Promise<BlockMechResponse | null> {
    try {
      const { mechId } = data;
      return await this.adminRepository.blockMech({ mechId });
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while blocking the mechanic from the AdminService"
      );
    }
  }

  async blockService(
    data: BlockServiceDTO
  ): Promise<BlockServiceResponse | null> {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockService({ _id });
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while blocking the service from the adminService"
      );
    }
  }

  async blockDevice(data: BlockDeviceDTO): Promise<BlockDeviceResponse | null> {
    try {
      const { _id } = data;
      return await this.adminRepository.BlockDevice({ _id });
    } catch (error) {
      console.log(error as Error);
      throw new Error("error while blocking the device from the adminService");
    }
  }

  async deleteUser(data: DeleteUserDTO): Promise<DeleteUserResponse | null> {
    try {
      const { userId } = data;
      return await this.adminRepository.deleteUser({ userId });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured while deleting the user");
    }
  }

  async deleteMech(data: DeleteMechDTO): Promise<DeleteMechResponse | null> {
    try {
      const { mechId } = data;
      return await this.adminRepository.deleteMech({ mechId });
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error while deleting the mechanic from the adminService "
      );
    }
  }

  async deleteService(
    data: DeleteServiceDTO
  ): Promise<DeleteServiceResponse | null> {
    try {
      const { serviceId } = data;
      return await this.adminRepository.deleteService({ serviceId });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while deleting a service from the admin Services");
    }
  }

  async deleteDevice(
    data: DeleteDeviceDTO
  ): Promise<DeleteDeviceResponse | null> {
    try {
      const { deviceId } = data;
      return await this.adminRepository.deleteDevice({ deviceId });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while deleteDevice from the adminService");
    }
  }

  async isServiceExist(
    data: IsServiceExistDTO
  ): Promise<IsServiceExistResponse | null> {
    try {
      const { name } = data;
      return await this.adminRepository.isServiceExist({ name });
    } catch (error) {
      console.log(error as Error);
      throw new Error("error while checking isServiceExist or not ");
    }
  }

  async addService(data: AddserviceDTO): Promise<AddNewServiceResponse | null> {
    try {
      const { values } = data;
      console.log("values from the service is ", values);
      return await this.adminRepository.addNewServices({ values });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while adding new Services in the adminService ");
    }
  }

  //adding new devices
  async addDevice(data: AddDeviceDTO): Promise<AddNewDeviceResponse | null> {
    try {
      const { name } = data;
      return await this.adminRepository.addNewDevice({ name });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while adding new Device form the adminService");
    }
  }

  //checking for the divce is existing or not for avoding the duplication
  async isDeviceExist(
    data: isDeviceExistDTO
  ): Promise<isDeviceExistResponse | null> {
    try {
      const { name } = data;
      return await this.adminRepository.isDeviceExist({ name });
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "error while checking the isDeviceExist in the adminService"
      );
    }
  }

  async editExistingService(
    data: EditExistServiceDTO
  ): Promise<EditExistServiceResponse | null> {
    try {
      const { _id, values } = data;
      return await this.adminRepository.editExistService({ _id, values });
    } catch (error) {
      console.log(error as Error);
      throw new Error("error while editExistingService in AdminService");
    }
  }

  async updateApprove (data:UpdateApproveDTO) : Promise<UpdateApproveResponse | null> {
    try{
      const {id , verificationStatus } = data;
      let modifiedVerificationStatus ;
      if(verificationStatus == "false"){
        modifiedVerificationStatus = true;
      }else{
        modifiedVerificationStatus= false;
      }
      if(id){
        const result = await this.adminRepository.updateApprove({id,modifiedVerificationStatus});
        return result;
      }
      return {result : false};
    }catch(error){
      console.log(error as Error);
      throw new Error("Error while approving the mechanic in the AdminSerivce");
    }
  }
  //changing this generating presinged url code ot differtnt comon place
  async getPresignedUrl(data: GetPreSignedUrlDTO) {
    try {
      const { fileName, fileType } = data;

      if (!fileName || !fileType) {
        return {
          success: false,
          message: "File name and type are required",
        } as GetPreSignedUrlResponse;
      }
      const folderName = "ServiceImages";
      const result = await generatePresignedUrl(fileName, fileType, folderName);
      return result as GetPreSignedUrlResponse;
    } catch (error) {
      console.log(error);
      throw new Error(
        "error while generating the presinged url from the adminService"
      );
    }
  }
}
export default adminService;
