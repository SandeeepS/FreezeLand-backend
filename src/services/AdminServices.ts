import { AdminInterface } from "../models/adminModel";
import { comService } from "./comServices";
import AdminRepository from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { IApiRes } from "../interfaces/commonInterfaces/getDetailInterface";
import { IMechsAndCount } from "../interfaces/serviceInterfaces/InMechService";
import { IUsersAndCount } from "../interfaces/serviceInterfaces/InaAdminService";


const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;


class AdminService implements comService<AdminInterface> {
  constructor(
    private adminRepository: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) {}

  async adminLogin(email: string, password: string): Promise<any> {
    try {
      console.log("entered in the admin login");
      const admin = await this.adminRepository.isAdminExist(email);

      if (admin?.password===password) {
     
          const token = this.createjwt.generateToken(admin?.id);
          const refreshToken = this.createjwt.generateRefreshToken(admin?.id);
          console.log("admin is exist", admin);
          return {
            status: STATUS_CODES.OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: admin,
              adminId: admin.id,
              token: token,
              refreshToken: refreshToken,
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
      
    
    } catch (error) {
      console.log("error occured while login admin");
      throw error;
    }
  }



  async getUserList(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<IUsersAndCount>> {
    try {
        if (isNaN(page)) page = 1;
        if (isNaN(limit)) limit = 10;
        if (!searchQuery) searchQuery = '';
        const users = await this.adminRepository.getUserList(page, limit, searchQuery);
        const usersCount = await this.adminRepository.getUserCount(searchQuery);

        return {
            status: STATUS_CODES.OK,
            data: { users, usersCount },
            message: 'success',
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error occured.');
    }
}

async getMechList(page: number, limit: number, searchQuery: string | undefined): Promise<IApiRes<IMechsAndCount>> {
  try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = '';
      const mechs = await this.adminRepository.getMechList(page, limit, searchQuery);
      console.log("list of mechanics is ",mechs);
      const mechsCount = await this.adminRepository.getMechCount(searchQuery);

      return {
          status: STATUS_CODES.OK,
          data: { mechs, mechsCount },
          message: 'success',
      }
  } catch (error) {
      console.log(error);
      throw new Error('Error occured.');
  }
}
}
export default AdminService;
