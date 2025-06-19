import { ObjectId, Types } from "mongoose";
import { IServices } from "../../Model/IService";

export interface IGetAdminById {
  id: string;
}

export interface GetAdminByIdResponse {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IIsAdminExist {
  email: string;
}

export interface IsAdminExistResponse {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IUpdateApprove{
  id:string ;
  modifiedVerificationStatus:boolean | undefined;
}

export interface UpdateApproveResponse{
   result : boolean;
}

export interface IGetUserList {
  page: number;
  limit: number;
  searchQuery: string;
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

export interface GetUserListResponse {
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

export interface IGetMechList{
  page: number;
  limit: number;
  searchQuery: string;
  search:string;
}

export interface GetMechListResponse {
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

export interface IGetAllServices {
  page: number;
  limit: number;
  searchQuery: string;
  search:string;

}

export interface GetAllServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetAllDevices{
  page: number;
  limit: number;
  searchQuery: string;
  search:string;
}

export interface GetAllDevicesResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetUserCount {
  searchQuery: string;
}

export interface IGetService {
  id: string;
}

export interface GetServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IEditExistService{
  _id: string;
  values: IServices;
}
export interface EditExistServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
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
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IBlockDevice{
  _id: string;
}

export interface BlockDeviceResponse {
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
  serviceCharge: number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface  IDeleteDevice {
  deviceId: string;
}
export interface DeleteDeviceResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IsServiceExist{
  name: string;
}

export interface IsServiceExistResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IisDeviceExist {
  name: string;
}

export interface isDeviceExistResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IAddNewService {
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

export interface IAddNewDevice{
  name: string;
}

export interface AddNewDeviceResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetMechCount {
  searchQuery: string;
}

export interface IGetServiceCount{
  searchQuery: string;
}

export interface IGetDeviceCount {
  searchQuery: string;
}
