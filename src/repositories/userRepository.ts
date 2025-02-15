import userModel, { UserInterface } from "../models/userModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { Document } from "mongoose";
import { Iconcern } from "../models/concernModel";
import concernModel from "../models/concernModel";
import { IServices} from "../models/serviceModel";
import serviceModel from "../models/serviceModel";
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
} from "../interfaces/DTOs/User/IRepository.dto";
import { IUserRepository } from "../interfaces/IRepository/IUserRepository";

class UserRepository extends BaseRepository<UserInterface & Document> implements IUserRepository {
  private concernRepository: BaseRepository<Iconcern>;
  private serviceRepository: BaseRepository<IServices>;
  
  constructor() {
    super(userModel);
    this.concernRepository = new BaseRepository<Iconcern>(concernModel);
    this.serviceRepository = new BaseRepository<IServices>(serviceModel);

  }

  async saveUser(
    newDetails: SaveUserDTO
  ): Promise<SaveUserResponse | null> {
    return this.save(newDetails);
  }

  async findEmail(data:FindEmailDTO): Promise<FindEmailResponse | null> {
    try {
      const {email} = data;
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

  async updateNewPassword(data:UpdateNewPasswordDTO): Promise<UpdateNewPasswordResponse | null> {
    try {
      const {userId,password} = data;
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

  async getUserById(data:GetUserByIdDTO): Promise<GetUserByIdResponse | null> {
    try{
      const {id} = data;
      return this.findById(id);
    }catch(error){
      console.log(error as Error);
      throw new Error("error occured while getting the getUserById in the userRepsoitory ");
    }
  }

  //methods used in the admin side
  async getUserList(
     data:GetUserListDTO
  ): Promise<GetUserListResponse[]> {
    try {
      const {page,limit,searchQuery} = data;
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
      return result ;
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
  async getAllUserRegisteredServices(data: GetAllUserRegisteredServicesDTO): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const {page,limit,searchQuery} = data;
      const regex = new RegExp(searchQuery, "i");

      const result = await this.concernRepository.findAll(page, limit, regex);
      console.log(
        "all the user registred complaints is hree sdlfsdflsdfd",
        result
      );
      return result ;
    } catch (error) {
      console.log(
        "error occured while fetching the data from the database in the userRepositry",
        error as Error
      );
      throw new Error();
    }
  }

  async editUser(data: EditUserDTO): Promise<EditUserResponse | null> {
    try {
      const qr = { name: data.name, phone: data.phone };
      const editedUser = await this.update(data._id, qr);
      return editedUser;
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

  async setDefaultAddress(data: SetUserDefaultAddressDTO): Promise<SetUserDefaultAddressResponse| null>  {
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

  async registerService(data: RegisterServiceDTO):Promise<RegisterServiceResponse | null> {
    try {
      console.log(
        "enterd in the userRepository for registering the user complaint"
      );
      const newConcern = await this.concernRepository.addConcern(data);
      return newConcern ;
    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }
}

export default UserRepository;
