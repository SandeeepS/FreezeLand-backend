import userModel, { TempUser } from "../models/userModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import mongoose, { Document } from "mongoose";
import { Iconcern } from "../models/concernModel";
import concernModel from "../models/concernModel";
import serviceModel from "../models/serviceModel";
import { IServices } from "../interfaces/Model/IService";

import {
  AddUserAddressDTO,
  AddUserAddressResponse,
  GetAllServicesDTO,
  GetAllServiceResponse,
  EditAddressDTO,
  EditUserDTO,
  EditUserResponse,
  EmailExistCheckDTO,
  EmailExistCheckResponse,
  RegisterServiceDTO,
  SetUserDefaultAddressDTO,
  GetServiceCountDTO,
  SaveUserDTO,
  SaveUserResponse,
  FindEmailDTO,
  FindEmailResponse,
  GetUserByIdDTO,
  GetUserByIdResponse,
  UpdateNewPasswordDTO,
  UpdateNewPasswordResponse,
  GetUserListResponse,
  GetUserListDTO,
  GetAllUserRegisteredServicesDTO,
  GetAllUserRegisteredServicesResponse,
  EditAddressResponse,
  SetUserDefaultAddressResponse,
  RegisterServiceResponse,
  getUserRegisteredServiceDetailsByIdResponse,
  IupdateUserLocation,
  IupdateUserLocationResponse,
  IUpdateTempDataWithOTP,
} from "../interfaces/DTOs/User/IRepository.dto";
import { IUserRepository } from "../interfaces/IRepository/IUserRepository";
import {
  getMechanicDetailsDTO,
  getMechanicDetailsResponse,
} from "../interfaces/DTOs/Mech/IRepository.dto";
import MechModel from "../models/mechModel";
import { Address, ITempUser, UserInterface } from "../interfaces/Model/IUser";
import { SingUpDTO } from "../interfaces/DTOs/User/IService.dto";
import { MechInterface } from "../interfaces/Model/IMech";

class UserRepository
  extends BaseRepository<UserInterface & Document>
  implements IUserRepository
{
  private concernRepository: BaseRepository<Iconcern>;
  private serviceRepository: BaseRepository<IServices>;
  private mechanicRepository: BaseRepository<MechInterface>;

  constructor() {
    super(userModel);
    this.concernRepository = new BaseRepository<Iconcern>(concernModel);
    this.serviceRepository = new BaseRepository<IServices>(serviceModel);
    this.mechanicRepository = new BaseRepository<MechInterface>(MechModel);
  }

  async saveUser(newDetails: SaveUserDTO): Promise<SaveUserResponse | null> {
    return this.save(newDetails);
  }

  //creating temperory userDta
  async createTempUserData(tempUserDetails: {
    otp: string;
    userData: SingUpDTO;
  }): Promise<ITempUser | null> {
    try {
      console.log("entered in the userRepository in userRepository");

      // Create the TempUser object with properly structured data
      const createdTempUser = new TempUser({
        otp: tempUserDetails.otp,
        userData: tempUserDetails.userData,
      });

      const savedUser = await createdTempUser.save();
      return savedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //function to get tempUserDAta from the data base
  async getTempUserData(id: string): Promise<ITempUser | null> {
    try {
      const result = await TempUser.findById(id);
      console.log("accessed the tempUserData in the userRepository", result);

      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async updateTempUserData(
    data: IUpdateTempDataWithOTP
  ): Promise<ITempUser | null> {
    try {
      const { tempUserId, otp } = data;
      const result = await TempUser.findByIdAndUpdate(tempUserId, { otp: otp });
      console.log("Updated tempUserData in the userTempUserData in the userRepository",result);
      return result;
    } catch (error) {
      console.log(
        "Error occured while udating the tempUserData while storing the new otp in the updateTempUserData , userRepository",
        error
      );
      throw error;
    }
  }

  //function to verify otp
  // async verifyOTP(otp:string) :Promise<boolean> {
  //   try{
  //     console.log("otp in the userRepository is ",otp);

  //   }catch(error){
  //     console.log(error as Error);
  //     throw error;
  //   }
  // }

  async findEmail(data: FindEmailDTO): Promise<FindEmailResponse | null> {
    try {
      const { email } = data;
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

  async emailExistCheck(
    data: EmailExistCheckDTO
  ): Promise<EmailExistCheckResponse | null> {
    const { email } = data;
    console.log("email find in userRepsoi", email);
    return this.findOne({ email: email }) as unknown as EmailExistCheckResponse;
  }

  async updateNewPassword(
    data: UpdateNewPasswordDTO
  ): Promise<UpdateNewPasswordResponse | null> {
    try {
      const { userId, password } = data;
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
  // In UserRepository.ts
  async getUserById(data: GetUserByIdDTO): Promise<GetUserByIdResponse | null> {
    try {
      const { id } = data;
      console.log("user id is in userRepository", id);
      const user = await this.findById(id);
      if (!user) {
        return null;
      }
      const defaultAddressDetails = user.address?.find(
        (addr) => addr._id.toString() === user.defaultAddress?.toString()
      );
  
      return {
        ...user.toObject(),
        defaultAddressDetails,
      };
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occurred while getting the user by ID in the userRepository"
      );
    }
  }

  //methods used in the admin side
  async getUserList(data: GetUserListDTO): Promise<GetUserListResponse[]> {
    try {
      const { page, limit, searchQuery } = data;
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

  //for used in getting all servce provided the website
  async getAllServices(
    data: GetAllServicesDTO
  ): Promise<GetAllServiceResponse[] | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const result = await this.serviceRepository.findAll(page, limit, regex);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //getting service count of the services provided by the website
  async getServiceCount(data: GetServiceCountDTO): Promise<number> {
    try {
      const { searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      return await this.serviceRepository.countDocument(regex);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //function for getting all the userRegistered services
  async getAllUserRegisteredServices(
    data: GetAllUserRegisteredServicesDTO
  ): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const { page, limit, userId } = data;
      const objectId = new mongoose.Types.ObjectId(userId);

      // Use aggregation to get user's registered services with lookups
      const result = await concernModel.aggregate([
        {
          $match: {
            userId: objectId,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users", // The users collection
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "services", // The services collection
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { "userDetails.password": 0 } }, // Exclude password
      ]);

      console.log("User registered services:", result);
      return result as GetAllUserRegisteredServicesResponse[];
    } catch (error) {
      console.log(
        "Error occurred while fetching user registered services:",
        error as Error
      );
      throw new Error(
        "Error occurred while fetching user registered services."
      );
    }
  }

  //function to get the specified registered usercomplaint details
  async getUserRegisteredServiceDetailsById(
    id: string
  ): Promise<getUserRegisteredServiceDetailsByIdResponse[]> {
    try {
      console.log("id in the getUserRegisteredServiceDetailsById", id);
      const objectId = new mongoose.Types.ObjectId(id);
      const result = await concernModel.aggregate([
        {
          $match: {
            _id: objectId,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        { $project: { "userDetails.password": 0 } },
      ]);
      console.log("User registered services:", result);
      return result as getUserRegisteredServiceDetailsByIdResponse[];
    } catch (error) {
      console.log(
        "Error occured while fetching userDetails in the userRepository ",
        error as Error
      );
      throw new Error("Errorrrrr");
    }
  }

  async editUser(data: EditUserDTO): Promise<EditUserResponse | null> {
    try {
      console.log("data for editing userDetails is ", data);
      const qr = {
        name: data.name,
        phone: data.phone,
        profile_picture: data.profile_picture,
      };
      const editedUser = await this.update(data._id, qr);
      return editedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  // //function to updateUserLocation for user

  async updateUserLocation(
    data: IupdateUserLocation
  ): Promise<IupdateUserLocationResponse | null> {
    try {
      const { userId, locationData } = data;
      console.log(
        "Enterd in the updateUserLocation in the usreRepository ",
        userId,
        locationData
      );
      const qr = { locationData: locationData };
      const editedUserData = await this.update(userId, qr);
      return editedUserData;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async addAddress(
    data: AddUserAddressDTO
  ): Promise<AddUserAddressResponse | null> {
    try {
      const { _id, values } = data;
      console.log("id from the userRepository while add addresss is ", _id);
      console.log("new address from the userRepository is ", values);
      const qr = { address: [values] };
      const addedAddress = await this.updateAddress(_id, qr);
      return addedAddress;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      const editedAddress = await this.editExistAddress(_id, addressId, values);
      return editedAddress;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async setDefaultAddress(
    data: SetUserDefaultAddressDTO
  ): Promise<SetUserDefaultAddressResponse | null> {
    try {
      const { userId, addressId } = data;
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

  async registerService(
    data: RegisterServiceDTO
  ): Promise<RegisterServiceResponse | null> {
    try {
      console.log(
        "enterd in the userRepository for registering the user complaint"
      );
      const newConcern = await this.concernRepository.addConcern(data);
      return newConcern;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //funciton to find mech details
  async getMechanicDetails(
    data: getMechanicDetailsDTO
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      const result = await this.mechanicRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while getting mechanic Details in mechRepository"
      );
    }
  }
}

export default UserRepository;
