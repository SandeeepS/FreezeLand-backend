import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { comRepository } from "./comRepository";

import { UserInterface } from "../models/userModel";
import userModel from "../models/userModel";
import MechModel, { MechInterface } from "../models/mechModel";

class AdminRepository implements comRepository<AdminInterface> {
  async getAdminById(id: string): Promise<AdminInterface | null> {
    try {
      const admin = await AdminModel.findById(id);
      return admin;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async isAdminExist(email: string): Promise<AdminInterface | null> {
    try {
      console.log("enterd in the isAdminExist", email);
      const admin = await AdminModel.findOne({ email: email });
      if (admin) {
        return admin as AdminInterface;
      } else {
        console.log("admin is not exists");
        return null;
      }
    } catch (error) {
      throw error;
    }
  }


  async getUserList(page: number, limit: number, searchQuery: string): Promise<UserInterface[]> {
    try {
        const regex = new RegExp(searchQuery, 'i');
        const result = await userModel.find(
            {
              isDeleted: false,
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                ]
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-password')
            .exec();
        return result as UserInterface[];
    } catch (error) {
        console.log(error as Error);
        throw new Error('Error occured');
    }
}

async getMechList(page: number, limit: number, searchQuery: string): Promise<MechInterface[]> {
  try {
      const regex = new RegExp(searchQuery, 'i');
      const result = await MechModel.find(
          {
              $or: [
                  { name: { $regex: regex } },
                  { email: { $regex: regex } }
              ]
          })
          .skip((page - 1) * limit)
          .limit(limit)
          .select('-password')
          .exec();
      return result as MechInterface[];
  } catch (error) {
      console.log(error as Error);
      throw new Error('Error occured');
  }
}


async getUserCount(searchQuery: string): Promise<number> {
  try {
      const regex = new RegExp(searchQuery, 'i');
      return await userModel.find(
          {
              $or: [
                  { name: { $regex: regex } },
                  { email: { $regex: regex } }
              ]
          }).countDocuments();
  } catch (error) {
      console.log(error as Error);
      throw new Error('Error occured');
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
          throw new Error('Somthing went wrong!!!');
         
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
          throw new Error('Somthing went wrong!!!');
         
      }
  } catch (error) {
      console.log(error as Error);
      return null;
  }
}

async getMechCount(searchQuery: string): Promise<number> {
  try {
      const regex = new RegExp(searchQuery, 'i');
      return await MechModel.find(
          {
              $or: [
                  { name: { $regex: regex } },
                  { email: { $regex: regex } }
              ]
          }).countDocuments();
  } catch (error) {
      console.log(error as Error);
      throw new Error('Error occured');
  }
}


  
}

export default AdminRepository;
