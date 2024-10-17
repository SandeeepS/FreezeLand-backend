import userModel, { UserInterface } from "../models/userModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { Document } from "mongoose";

class UserRepository extends BaseRepository<UserInterface & Document> {
  constructor() {
    super(userModel);
  }

  async saveUser(
    userData: Partial<UserInterface>
  ): Promise<UserInterface | null> {
    return this.save(userData);
  }

  async findEmail(email: string): Promise<UserInterface | null> {
    try {
      const userFound = await this.findOne({ email });
      if (userFound) {
        console.log("user email found successfully", userFound);
        return userFound;
      }
      return null;
    } catch (error) {
      console.log(
        "Error in UserRepository while finding the email",
        error as Error
      );
      throw error;
    }
  }

  async emailExistCheck(email: string): Promise<UserInterface | null> {
    console.log("email find in userRepsoi", email);

    return this.findOne({ email });
  }

  async updateNewPassword(
    password: string,
    userId: string
  ): Promise<UserInterface | null> {
    try {
      const user = await this.findById(userId);
      if (user) {
        user.password = password;
        return await user.save();
      }
      return null;
    } catch (error) {
      console.log(
        "Error in UserRepository while updating password",
        error as Error
      );
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserInterface | null> {
    return this.findById(id);
  }
}

export default UserRepository;
