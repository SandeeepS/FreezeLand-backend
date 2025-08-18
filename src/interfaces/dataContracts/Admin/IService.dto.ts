import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import Device from "../../entityInterface/Idevice";
import Mech from "../../entityInterface/Imech";
import User from "../../entityInterface/Iuser";
import Service from "../../entityInterface/Iservices";
import {  Types } from "mongoose";
import { IServices } from "../../Model/IService";

export interface IAdminLogin {
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
  search:string;
}

export interface IUpdateApprove{
  id:string ;
  verificationStatus: string;
}

export interface UpdateApproveResponse{
   result : boolean;
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
  search:string;
}

export interface GetMechListResponse {
  status: STATUS_CODES;
  data: {
    mechs: Mech[];
    mechsCount: number;
  };
  message: string;
}

export interface IGetServices {
  page: number;
  limit: number;
  searchQuery: string | undefined;
  search:string;

}

export interface GetServiceResponse {
  status: STATUS_CODES;
  data: {
    services: Service[] | null;
    servicesCount: number;
  };
  message: string;
}

export interface IGetDevice {
  page: number;
  limit: number;
  searchQuery: string | undefined;
  search:string;
}

export interface GetDeviceResponse {
  status: STATUS_CODES;
  data: {
    devices: Device[] | null;
    devicesCount: number;
  };
  message: string;
}

export interface IGetService {
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

export interface IGetMechanicById {
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

export interface IBlockUser {
  userId: string;
}

export interface BlockUserResponse {
  _id: Types.ObjectId;
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

export interface IBlockMech {
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

export interface IBlockService {
  _id: string;
}

export interface BlockServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IBlockDevice{
  _id: string;
}


export interface BlockDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface IDeleteUser {
  userId: string;
}

export interface DeleteUserResponse {
  _id: Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: Types.ObjectId;
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IDeleteMech {
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

export interface  IDeleteService{
  serviceId: string;
}

export interface DeleteServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface  IDeleteDevice {
  deviceId: string;
}

export interface DeleteDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface IsServiceExistResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IAddService {
  values: string;
}
export interface AddNewServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface  IAddDevice {
  name: string;
}

export interface AddNewDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IisDeviceExist {
  name: string;
}

export interface isDeviceExistResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IEditExistService{
  _id: string;
  values: IServices;
}

export interface EditExistServiceResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetPreSignedUrl{
  fileName:string;
  fileType:string;
  folderName:string;
}

export interface GetPreSignedUrlResponse {
  success?:boolean;
  message?:string;
  uploadURL?:string;
  imageName?:string;
  key?:string;

}

export interface GetMechByIdResponse {
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
