import { AddAddress } from "../../commonInterfaces/AddAddress";
import mongoose, { Types } from "mongoose";
import Iuser from "../../entityInterface/Iuser";
import { UserInterface } from "../../Model/IUser";
import { IServices } from "../../Model/IService";

export interface ISaveUser {
  name: string;
  password: string;
  email: string;
  phone?: number;
}

export interface IcreateTempUserData {
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

export interface IcreateTempUserDataResponse {
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
  address: Types.ObjectId;
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IFindEmail {
  email: string;
}

export interface IUpdateTempDataWithOTP {
  tempUserId:string;
  otp:string;
}

export interface FindEmailResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  address:Types.ObjectId;
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IEmailExistCheck{
  email: string;
}

export interface EmailExistCheckResponse {
  id: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  password:string;
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

export interface IUpdateNewPassword {
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
  address: Types.ObjectId;
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetUserById {
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

export interface IGetUserList {
  page: number;
  limit: number;
  searchQuery: string;
  search:string;
}

export interface GetUserListResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  address:Types.ObjectId;
  defaultAddress: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface IEditUser {
  _id: string;
  name: string;
  phone: number;
  profile_picture:string;
}

export interface EditUserResponse {
  id?: string;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address:Types.ObjectId;
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetAllServices {
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

// export interface IAddUserAddress {
//   _id: string;
//   values: Address;
// }

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

export interface IEditAddress {
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
  address:Types.ObjectId;
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ISetUserDefaultAddress {
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
  address: Types.ObjectId;
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface IRegisterService {
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

export interface IGetServiceCount{
  searchQuery: string;
}

export interface IGetAllUserRegisteredServices {
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


export interface IupdateUserLocationResponse {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phone: number;
    profile_picture: string;
    locationData: {
      type: {
        type: string;
        enum: string[];
        default: string;
      };
      coordinates: number[];
      city: string;
      state: string;
    };
    address: Types.ObjectId;
    defaultAddress: string;
    role: string;
  
    isBlocked: boolean;
    isDeleted: boolean;
}


export interface ILocationData{
    type: {
    type: string;
    enum: string[];
    default: string;
  };
  coordinates: number[]; 
  city: string;
  state: string;
}
export interface IupdateUserLocation{
  userId:string;
  locationData:ILocationData
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
