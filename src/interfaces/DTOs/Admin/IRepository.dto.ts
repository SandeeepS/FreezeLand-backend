import { ObjectId, Types } from "mongoose";
import { IServices } from "../../../models/serviceModel";

export interface GetAdminByIdDTO {
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

export interface IsAdminExistDTO {
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

export interface GetUserListDTO {
  page: number;
  limit: number;
  searchQuery: string;
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

export interface GetMechListDTO {
  page: number;
  limit: number;
  searchQuery: string;
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

export interface GetAllServicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetAllServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetAllDevicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetAllDevicesResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetUserCountDTO {
  searchQuery: string;
}

export interface GetServiceDTO {
  id: string;
}

export interface GetServiceResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
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

export interface BlockServiceResponse{
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

export interface DeleteServiceResponse{
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

export interface IsDeviceExistDTO {
  name: string;
}

export interface isDeviceExistResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddNewServiceDTO {
  values: string;
}

export interface AddNewServiceResponse{
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface AddNewDeviceDTO {
  name: string;
}

export interface AddNewDeviceResponse{
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetMechCountDTO {
  searchQuery: string;
}

export interface GetServiceCountDTO {
  searchQuery: string;
}

export interface GetDeviceCountDTO {
  searchQuery: string;
}
