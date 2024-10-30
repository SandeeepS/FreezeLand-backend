import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { Document } from "mongoose";
import { BaseRepository } from "./BaseRepository/baseRepository";
import serviceModel, { IServices } from "../models/serviceModel";
import { UserInterface } from "../models/userModel";
import { MechInterface } from "../models/mechModel";
import UserRepository from "./userRepository";
import MechRepository from "./mechRepository";

class AdminRepository extends BaseRepository<AdminInterface & Document> {
  private userRepository: UserRepository;
  private mechRepository: MechRepository;
  private serviceRepository : BaseRepository<IServices>
  constructor() {
    super(AdminModel);
    this.userRepository = new UserRepository();
    this.mechRepository = new MechRepository();
    this.serviceRepository = new BaseRepository<IServices>(serviceModel)
  }
  async getAdminById(id: string): Promise<AdminInterface | null> {
    try {
      const admin = await this.findById(id);
      return admin;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async isAdminExist(email: string): Promise<AdminInterface | null> {
    try {
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
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<UserInterface[]> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const result = await this.userRepository.findAll(page, limit, regex);
      console.log("users list is ", result);
      return result as UserInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getMechList(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<MechInterface[]> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const result = await this.mechRepository.getMechList(page, limit, regex);
      return result as MechInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }


  async getAllServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<IServices[]> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const result = await this.serviceRepository.findAll(page, limit, regex);
      return result as IServices[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getUserCount(searchQuery: string): Promise<number> {
    try {
      const regex = new RegExp(searchQuery, "i");
      return await this.userRepository.getUserCount(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }


  async getService(id:string) {
    try{
      console.log("entered in the getService in the adminRepository");
      const result = await this.serviceRepository.findById(id);
      return result;
    }catch(error){
      console.log(error as Error);
      throw new Error;
    }
  }

  async editExistService(_id:string,values:IServices){
    try{
      const editedService = await this.serviceRepository.update(_id,values);
      return editedService;
    }catch(error){
      console.log(error as Error);
      throw new Error;
    }
  }

  async blockUser(userId: string) {
    try {
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

  async blockMech(mechId: string) {
    try {
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

   async BlockService(_id:string){
    try{
      const service = await this.serviceRepository.findById(_id);
      if(service){
        service.isBlocked = !service?.isBlocked;
        await this.serviceRepository.save(service);
        return service;
      }
    }catch(error){
      console.log(error as Error);

    }
   }
  async deleteUser(userId: string) {
    try {
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

  async deleteMech(mechId: string) {
    try {
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
  

  async deleteService(serviceId: string) {
    try {
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


  async addNewServices(values: string) {
    try {
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

  async getMechCount(searchQuery: string): Promise<number> {
    try {
      const regex = new RegExp(searchQuery, "i");
      return await this.mechRepository.getMechCount(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getServiceCount(searchQuery: string): Promise<number> {
    try {
      const regex = new RegExp(searchQuery, "i");
      return await this.serviceRepository.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }
}

export default AdminRepository;
