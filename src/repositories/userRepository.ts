import userModel, { UserInterface } from "../models/userModel";
import { comRepository } from "./comRepository";

class UserRepository implements comRepository<UserInterface> {
  async saveUser(
    userData: Partial<UserInterface>
  ): Promise<UserInterface | null> {
    try {
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser as UserInterface;
    } catch (error) {
      console.log("Error from userRepository", error as Error);
      throw error
    }
  }

  async findEmail(email: string): Promise<UserInterface | null> {
    try {
      const userFound = await userModel.findOne({ email: email });
      console.log("user is ", userFound);
      if (userFound) {
        console.log("user email found successfully", userFound);
        return userFound as UserInterface;
      }
      return null;
    } catch (error) {
      console.log(
        "error found in the userRepository while finding the email ",
        error as Error
      );
      throw error
    
    }
  }

  async emailExistCheck(email: string): Promise<UserInterface | null> {
    try {
      const userFound = await userModel.findOne({ email: email });
      return userFound as UserInterface;
    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }

  async updateNewPassword(password: string, userId: string) {
    try {
      const user = await userModel.findById(userId);
      if (user) user.password = password;
      const updatedUser = await user?.save();
      return updatedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserInterface | null> {
    try {
      return await userModel.findById(id);
    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }
}

export default UserRepository;
