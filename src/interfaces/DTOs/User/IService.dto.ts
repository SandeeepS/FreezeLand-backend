import { UserInterface } from "../../../models/userModel";
import User from "../../entityInterface/Iuser";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { AddAddress } from "../../commonInterfaces/AddAddress";
import { Types } from "mongoose";

export interface UserSignUpDTO {
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
}

export interface UserSignUpResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: UserInterface;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface UserLoginResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: User;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface SaveUserDTO {
  id?: string;
  name: string;
  email: string;
  phone?: number;
  password: string;
  profile_picture: string;
}

export interface SaveUserResponse {
  success: boolean;
  message: string;
  userId?: string;
  data?: User;
  token?: string | undefined;
  refresh_token?: string | undefined;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface NewDetailsDTO {
  name: string;
  password: string;
  email: string;
  phone: number | undefined;
}

export interface EmailExistCheckDTO {
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

export interface EmailExistCheckResponse {
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

export interface GetProfileDTO {
  id: string | undefined;
}

export interface GetProfileResponse {
  status: STATUS_CODES;
  data: {
    success: boolean;
    message: string;
    data?: User;
  };
}

export interface EditUserDTO {
  _id:string;
  name:string;
  phone:number;
}

export interface EditUserResponse{
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
  defaultAddress:string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddUserAddressDTO {
  _id:string;
  values: AddAddress;
}


export interface AddUserAddressResponse{
  name:string,
  phone:number,
  email:string,
  state:string,
  pin:number,
  district:string,
  landMark:string,
}

export interface EditAddressDTO{
  _id:string;
  addressId:string;
  values:AddAddress;
}

export interface SetUserDefaultAddressDTO {
  userId:string;
  addressId:string;
}

export interface GetUserByEmail {
  email:string;
}


export interface GenerateTokenDTO{
  payload:string | undefined;
}

export interface GenerateRefreshToken {
  payload:string | undefined;
}

export interface RegisterServiceDTO {
    _id: Types.ObjectId ;
    name: string;
    image: [];
    service: Types.ObjectId;
    defaultAddress: Types.ObjectId;
    discription: string;
    locationName: object;
    isBlocked: boolean;
    isDeleted: boolean;
}


