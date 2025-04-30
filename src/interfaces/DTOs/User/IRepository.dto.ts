import { AddAddress } from "../../commonInterfaces/AddAddress";
import { Types } from "mongoose";
import Iuser from "../../entityInterface/Iuser";
import { IServices } from "../../../models/serviceModel";
import { Address, UserInterface } from "../../Model/IUser";

export interface SaveUserDTO {
  name: string;
  password: string;
  email: string;
  phone?: number;
}

export interface createTempUserDataDTO {
  name: string;
  phone: string;
  password: string;
  cpassword: string;
  email: string;
  otp: string;
}

export interface UserSignUpResponse extends Document {
  userData:Partial<UserInterface>;
  otp:string;
  createdAt:Date;
  _id:Types.ObjectId;
}

export interface createTempUserDataDTOResponse {
  name: string;
  phone: string;
  password: string;
  cpassword: string;
  email: string;
  otp: string;
}

export interface SaveUserResponse {
  _id: Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface FindEmailDTO {
  email: string;
}

export interface FindEmailResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface EmailExistCheckDTO {
  email: string;
}

export interface EmailExistCheckResponse {
  id: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface UpdateNewPasswordDTO {
  password: string;
  userId: string;
}

export interface UpdateNewPasswordResponse {
  id?: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetUserByIdDTO {
  id: string;
}
export interface GetUserByIdResponse {
  id?: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  address: {
    _id:string;
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetUserListDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetUserListResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface EditUserDTO {
  _id: string;
  name: string;
  phone: number;
  imageKey:string;
}

export interface EditUserResponse {
  id?: string;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetAllServicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetAllServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge: number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddUserAddressDTO {
  _id: string;
  values: Address;
}

export interface AddUserAddressResponse {
  _id: Types.ObjectId;
  name: string;
  phone: number;
  email: string;
  state?: string;
  pin?: number;
  district?: string;
  landMark?: string;
}

export interface EditAddressDTO {
  _id: string;
  addressId: string;
  values: AddAddress;
}

export interface EditAddressResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  role: string;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface SetUserDefaultAddressDTO {
  userId: string;
  addressId: string;
}

export interface SetUserDefaultAddressResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface RegisterServiceDTO {
  _id: Types.ObjectId;
  name: string;
  image: [];
  serviceId: Types.ObjectId;
  userId: Types.ObjectId;
  defaultAddress: Types.ObjectId;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface RegisterServiceResponse {
  _id: Types.ObjectId;
  name: string;
  image: [];
  serviceId: Types.ObjectId;
  userId: Types.ObjectId;
  defaultAddress: Types.ObjectId;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetServiceCountDTO {
  searchQuery: string;
}

export interface GetAllUserRegisteredServicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
  userId: string;
}

export interface GetAllUserRegisteredServicesResponse {
  _id: Types.ObjectId;
  name: string;
  image: [];
  serviceId: Types.ObjectId;
  userId: Types.ObjectId;
  defaultAddress: Types.ObjectId;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails: Iuser;
  serviceDetails: IServices;
}

export interface getUserRegisteredServiceDetailsByIdResponse {
  _id: string;
  name: string;
  image: [];
  serviceId: string;
  userId: string;
  defaultAddress: string;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails: Iuser;
  serviceDetails: IServices;
}
