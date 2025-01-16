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
  image: string;
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
  searchQuery : string;
}

export interface GetServiceDTO{
   id:string;
}

export interface EditExistServiceDTO {
  _id:string;
  values:IServices
}

export interface BlockUserDTO{
  userId:string;
}

export interface BlockMechDTO {
  mechId:string;
}

export interface BlockServiceDTO{
  _id:string;
}

export interface BlockDeviceDTO{
  _id:string;
}

export interface DeleteUserDTO {
  userId:string;
}

export interface DeleteMechDTO {
  mechId:string;
}

export interface DeleteServiceDTO {
  serviceId :string
}

export interface DeleteDeviceDTO{
  deviceId : string;
}

export interface IsServiceExistDTO {
  name:string ;
}

export interface IsDeviceExistDTO {
  name:string;
}

export interface AddNewServiceDTO{
  values:string;
}

export interface AddNewDeviceDTO{
  name :string;
}

export interface GetMechCountDTO {
  searchQuery:string;
}

export interface GetServiceCountDTO{
  searchQuery:string;
}

export interface GetDeviceCountDTO{
  searchQuery:string;
}




