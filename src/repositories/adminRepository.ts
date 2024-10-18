import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { Document } from "mongoose";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { UserInterface } from "../models/userModel";
import userModel from "../models/userModel";
import MechModel, { MechInterface } from "../models/mechModel";
import UserRepository from "./userRepository";
import MechRepository from "./mechRepository";

class AdminRepository extends BaseRepository<AdminInterface & Document> {
  private userRepository: UserRepository;
  private mechRepository: MechRepository;
  constructor() {
    super(AdminModel);
    this.userRepository = new UserRepository();
    this.mechRepository = new MechRepository();
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
      const result = await this.mechRepository.getMechList(page,limit,regex)
      return result as MechInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async getUserCount(searchQuery: string): Promise<number> {
    try {
      const regex = new RegExp(searchQuery, "i");
      return await userModel
        .find({
          $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
        })
        .countDocuments();
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  async blockUser(userId: string) {
    try {
      const user = await userModel.findById(userId);
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
      const mech = await MechModel.findById(mechId);
      if (mech) {
        mech.isBlocked = !mech?.isBlocked;
        await mech.save();
        return mech;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        user.isDeleted = !user?.isDeleted;
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

  async deleteMech(mechId: string) {
    try {
      const mech = await MechModel.findById(mechId);
      if (mech) {
        mech.isDeleted = !mech?.isDeleted;
        await mech.save();
        return mech;
      } else {
        throw new Error("Somthing went wrong!!!");
      }
    } catch (error) {
      console.log(error as Error);
      return null;
    }
  }

  async getMechCount(searchQuery: string): Promise<number> {
    try {
      const regex = new RegExp(searchQuery, "i");
      return await MechModel.find({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      }).countDocuments();
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }
}

export default AdminRepository;
