import { comService } from "./comServices";
import AdminRepository from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import { IApiRes } from "../interfaces/commonInterfaces/getDetailInterface";
import { IMechsAndCount } from "../interfaces/serviceInterfaces/InMechService";
import {
  AdminAuthResponse,
  IUsersAndCount,
} from "../interfaces/serviceInterfaces/InaAdminService";
import { IUserServiceAndCount } from "../interfaces/serviceInterfaces/userServiceInterfaces";
import { IServices } from "../models/serviceModel";

class adminService implements comService<AdminAuthResponse> {
  constructor(
    private adminRepository: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) {}

  async adminLogin(
    email: string,
    password: string
  ): Promise<AdminAuthResponse> {
    try {
      console.log("entered in the admin login");
      const admin = await this.adminRepository.isAdminExist(email);

      if (admin?.password === password) {
        console.log("passwrod from the admin side is ",admin.password);
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
    } catch (error) {
      console.log("error occured while login admin");
      throw error;
    }
  }

  async getUserList(
    page: number,
    limit: number,
    searchQuery: string | undefined
  ): Promise<IApiRes<IUsersAndCount>> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const users = await this.adminRepository.getUserList(
        page,
        limit,
        searchQuery
      );
      const usersCount = await this.adminRepository.getUserCount(searchQuery);

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

  async getMechList(
    page: number,
    limit: number,
    searchQuery: string | undefined
  ): Promise<IApiRes<IMechsAndCount>> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const mechs = await this.adminRepository.getMechList(
        page,
        limit,
        searchQuery
      );
      console.log("list of mechanics is ", mechs);
      const mechsCount = await this.adminRepository.getMechCount(searchQuery);

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

  
  async getServices(
    page: number,
    limit: number,
    searchQuery: string | undefined
  ): Promise<IApiRes<IUserServiceAndCount>> {
    try {
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const services = await this.adminRepository.getAllServices(
        page,
        limit,
        searchQuery
      );
      console.log("list of services  is ", services);
      const  servicesCount = await this.adminRepository.getServiceCount(searchQuery);

      return {
        status: STATUS_CODES.OK,
        data: {services,  servicesCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }


  async getService(id:string) {
    try{
        console.log('reached the getService in the adminService');
        const result = await this.adminRepository.getService(id);
        if(result){
          return result;
        }
    }catch(error){
      console.log(error as Error);
      throw new Error
    }
  }
  async blockUser(userId: string) {
    try {
      return await this.adminRepository.blockUser(userId);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async blockMech(mechId: string) {
    try {
      return await this.adminRepository.blockMech(mechId);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async blockService(_id:string){
    try{
      return await this.adminRepository.BlockService(_id);
    }catch(error){
      console.log(error as Error);

    }
  }

  async deleteUser(userId: string) {
    try {
      return await this.adminRepository.deleteUser(userId);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async deleteMech(mechId: string) {
    try {
      return await this.adminRepository.deleteMech(mechId);
    } catch (error) {
      console.log(error as Error);
    }
  }


  async deleteService(serviceId: string) {
    try {
      return await this.adminRepository.deleteService(serviceId);
    } catch (error) {
      console.log(error as Error);
    }
  }


  async isServiceExist (name:string){
    try{
      return await this.adminRepository.isServiceExist(name);
    }catch(error){
      console.log(error as Error)
    }
  }

  async addService (values:string){
    try{
      return await this.adminRepository.addNewServices(values);

    }catch(error){
      console.log(error as Error);
    }
  }

  async editExistingService(_id:string,values:IServices){
    try{
      return await this.adminRepository.editExistService(_id,values);
    }catch(error){
      console.log(error as Error);
      throw error as Error
    }
  }
}
export default adminService;
