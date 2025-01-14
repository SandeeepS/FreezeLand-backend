import userModel, { UserInterface } from "../models/userModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { Document } from "mongoose";
import { AddAddress } from "../interfaces/commonInterfaces/AddAddress";
import { Iconcern } from "../models/concernModel";
import concernModel from "../models/concernModel";
import { EmailExistCheckDTO, EmailExistCheckResponse } from "../interfaces/DTOs/User/IRepository.dto";

class UserRepository extends BaseRepository<UserInterface & Document> {
  private concernRepository: BaseRepository<Iconcern>;

  constructor() {
    super(userModel);
    this.concernRepository = new BaseRepository<Iconcern>(concernModel);
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

  async emailExistCheck(email: string): Promise<EmailExistCheckResponse | null> {
    console.log("email find in userRepsoi", email);
    return this.findOne({ email: email });
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

  //methods used in the admin side
  async getUserList(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<UserInterface[]> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const result = await this.findAll(page, limit, regex);
      console.log("users list is ", result);
      return result as UserInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //getting the userCount
  async getUserCount(regex: RegExp): Promise<number> {
    try {
      const result = await this.countDocument(regex);
      return result as number;
    } catch (error) {
      console.log(
        "error occured while getting the count in the userRepository",
        error
      );
      throw new Error();
    }
  }

  //function for getting all the userRegistered services
  async getAllUserRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<unknown> {
    try {
      const regex = new RegExp(searchQuery, "i");

      const data = await this.concernRepository.findAll(page, limit, regex);
      console.log(
        "all the user registred complaints is hree sdlfsdflsdfd",
        data
      );
      return data as unknown;
    } catch (error) {
      console.log(
        "error occured while fetching the data from the database in the userRepositry",
        error as Error
      );
      throw new Error();
    }
  }

  async editUser(
    id: string,
    name: string,
    phone: number
  ): Promise<UserInterface | null> {
    try {
      const qr = { name: name, phone: phone };
      const editedUser = await this.update(id, qr);
      return editedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async addAddress(
    _id: string,
    values: AddAddress
  ): Promise<UserInterface | null> {
    try {
      console.log("new address from the userRepository is ", values);
      const qr = { address: [values] };
      const addedAddress = await this.updateAddress(_id, qr);
      return addedAddress;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async editAddress(
    _id: string,
    addressId: string,
    values: AddAddress
  ): Promise<UserInterface | null> {
    try {
      const editedAddress = await this.editExistAddress(_id, addressId, values);
      return editedAddress;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async setDefaultAddress(userId: string, addressId: string) {
    try {
      console.log(
        "enterd in the userRepository for upaidng the default address",
        userId,
        addressId
      );
      const qr = { defaultAddress: addressId };
      const updatedUser = await this.update(userId, qr);
      return updatedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async registerService(data: Iconcern) {
    try {
      console.log(
        "enterd in the userRepository for registering the user complaint"
      );
      const newConcern = await this.concernRepository.addConcern(data);
      return newConcern as Iconcern;
    } catch (error) {
      console.log(error as Error);
    }
  }
}

export default UserRepository;
