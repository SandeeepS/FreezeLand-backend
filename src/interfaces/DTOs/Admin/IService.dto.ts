import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { IServices } from "../../../models/serviceModel";
import Device from "../../entityInterface/Idevice";
import Mech from "../../entityInterface/Imech";
import User from "../../entityInterface/Iuser";
import Service from "../../entityInterface/Iservices";
import {  Types } from "mongoose";

export interface AdminLoginDTO {
  email: string;
  password: string;
  role: string;
}

export interface AdminLoginResponse {
  status: STATUS_CODES;
  data: {
    success: boolean;
    message: string;
    data?: object;
    adminId?: string;
    token?: string | undefined;
    refresh_token?: string | undefined;
  };
}

export interface GetUserList {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetUserListResponse {
  status: STATUS_CODES;
  data: {
    users: Partial<User>[];
    usersCount: number;
  };
  message: string;
}

export interface GetMechList {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetMechListResponse {
  status: STATUS_CODES;
  data: {
    mechs: Mech[];
    mechsCount: number;
  };
  message: string;
}

export interface GetServicesDTO {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetServiceResponse {
  status: STATUS_CODES;
  data: {
    services: Service[] | null;
    servicesCount: number;
  };
  message: string;
}

export interface GetDeviceDTO {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetDeviceResponse {
  status: STATUS_CODES;
  data: {
    devices: Device[] | null;
    devicesCount: number;
  };
  message: string;
}

export interface GetServiceDTO {
  id: string;
}


export interface GetServiceResponse2 {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetMechanicByIdDTO {
  id:string;
}

export interface GetMechanicByIdResponse{
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: number;
    role: string;
    mechanicType: string[];
    photo: string;
    adharProof: string;
    employeeLicense: string;
    isVerified: boolean;
    isBlocked: boolean;
    isDeleted: boolean;
}

export interface BlockUserDTO {
  userId: string;
}

export interface BlockUserResponse {
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
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface BlockMechDTO {
  mechId: string;
}

export interface BlockMechResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface BlockServiceDTO {
  _id: string;
}

export interface BlockServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface BlockDeviceDTO {
  _id: string;
}


export interface BlockDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface DeleteUserDTO {
  userId: string;
}

export interface DeleteUserResponse {
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
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface DeleteMechDTO {
  mechId: string;
}

export interface DeleteMechResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface DeleteServiceDTO {
  serviceId: string;
}

export interface DeleteServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface DeleteDeviceDTO {
  deviceId: string;
}

export interface DeleteDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface IsServiceExistDTO {
  name: string;
}
export interface IsServiceExistResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddserviceDTO {
  values: string;
}
export interface AddNewServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddDeviceDTO {
  name: string;
}

export interface AddNewDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface isDeviceExistDTO {
  name: string;
}

export interface isDeviceExistResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface EditExistServiceDTO {
  _id: string;
  values: IServices;
}

export interface EditExistServiceResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetPreSignedUrlDTO{
  fileName:string;
  fileType:string;
}

export interface GetPreSignedUrlResponse {
  success?:boolean;
  message?:string;
  uploadURL?:string;
  imageName?:string;
  key?:string;

}
