
import Iuser from "../../entityInterface/Iuser";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { AddAddress } from "../../commonInterfaces/AddAddress";
import Service from "../../entityInterface/Iservices";
import { Types } from "mongoose";
import { Address, ITempUser } from "../../Model/IUser";
import { ILoginResponse } from "../../entityInterface/ILoginResponse";

export interface SingUpDTO{
  name:string;
  phone:number;
  email:string;
  password:string;
  cpassword:string;
}

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

export interface UserSignUpResponse extends Document {
  userData:Partial<ITempUser>;
  otp:string;
  createdAt:Date;
}

export interface UserLoginResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: ILoginResponse;
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
  data?: Iuser;
  token?: string | undefined;
  refresh_token?: string | undefined;
}

export interface GetServiceDTO {
  id: string;
}


export interface GetServiceResponse2 {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface ReturnUserdataDTO {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: string;
  isDeleted: boolean;
  isBlocked: boolean;
  profile_picture: string;
}

export interface NewDetailsDTO {
  name: string;
  password: string;
  email: string;
  phone: number | undefined;
}

export interface EmailExistCheckDTO {
  id: string;
  name: string;
  email: string;
  phone: number;
  password?: string;
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

export interface GetProfileDTO {
  id: string;
}

export interface GetProfileResponse {
  status: STATUS_CODES;
  data: {
    success: boolean;
    message: string;
    data?: Iuser;
  };
}

export interface verifyOTPResponse{
  success: boolean;
  message: string;
  userId?: string;
  token?: string;
  data?: object;
  refresh_token?: string;
}

export interface GetServicesDTO {
  page: number;
  limit: number;
  searchQuery: string | undefined;
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

export interface GetServiceResponse {
  status: STATUS_CODES;
  data: {
    services: Service[] | null;
    servicesCount: number;
  };
  message: string;
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

export interface AddUserAddressDTO {
  _id: string;
  values: Address;
}

export interface AddUserAddressResponse {
  _id: Types.ObjectId;
  values: AddAddress;
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

export interface GetUserByEmail {
  email: string;
}

export interface GenerateTokenDTO {
  payload: string | undefined;
}

export interface GenerateRefreshToken {
  payload: string | undefined;
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

export interface IPaymentData {
  complaintId: string;
  status: string;
  mechanicId: string;
  amount: number;
  serviceId: string;
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

export interface getUserRegisteredServiceDetailsByIdResponse{
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
  userDetails: object;
  serviceDetails: object;
}
