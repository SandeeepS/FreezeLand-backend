import userModel, { UserInterface } from "../models/userModel";
import { UserBaseRepository } from "./BaseRepository/UserBaseRepository";
import { Document } from "mongoose";

class UserRepository extends UserBaseRepository<UserInterface & Document> {
  constructor() {
    super(userModel); // Pass the user model to the BaseRepository
  }

  // Method from BaseRepository: saveUser (this is now handled by BaseRepository save)
  async saveUser(userData: Partial<UserInterface>): Promise<UserInterface | null> {
    return this.save(userData); // Use the base class method
  }

  // Custom method to find user by email
  async findEmail(email: string): Promise<UserInterface | null> {
    try {
      const userFound = await this.findOne({ email });
      if (userFound) {
        console.log("user email found successfully", userFound);
        return userFound;
      }
      return null;
    } catch (error) {
      console.log("Error in UserRepository while finding the email", error as Error);
      throw error;
    }
  }

  // Method to check if an email exists (this is just another alias for findEmail)
  async emailExistCheck(email: string): Promise<UserInterface | null> {
    console.log("email find in userRepsoi",email);

    return this.findOne({ email });
  }

  // Custom method to update the user's password
  async updateNewPassword(password: string, userId: string): Promise<UserInterface | null> {
    try {
      const user = await this.findById(userId);
      if (user) {
        user.password = password;
        return await user.save();
      }
      return null;
    } catch (error) {
      console.log("Error in UserRepository while updating password", error as Error);
      throw error;
    }
  }

  // Method from BaseRepository: getUserById (findById is already handled by BaseRepository)
  async getUserById(id: string): Promise<UserInterface | null> {
    return this.findById(id); // Use the base class method
  }
}

export default UserRepository;
