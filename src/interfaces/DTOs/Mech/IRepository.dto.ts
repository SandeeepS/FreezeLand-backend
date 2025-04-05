import  { Types } from "mongoose";

export interface EmailExitCheck {
  email: string;
}

export interface EmailExistResponse {
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
export interface SaveMechDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface SaveMechResponse {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface UpdateNewPasswordDTO {
  password: string;
  mechId: string;
}

export interface UpdateNewPasswordResponse {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface GetMechByIdDTO {
  id: string;
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

export interface GetMechListDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetMechListResponse {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface AddServiceDTO {
  values: string;
}

export interface GetAllDevicesResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface VerifyMechanicDTO {
  name:string;
  id:string;
  mechanicType: string[];
  photo: string;
  adharProof: string;
  employeeLicense: string;
}

export interface getMechanicDetailsDTO {
  id:string;
}

export interface getMechanicDetailsResponse {
  _id:Types.ObjectId | string;
  name: string;
  email: string;
  phone: number;
  role: string;
  photo: string;
  adharProof: string | null; 
  employeeLicense: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  mechanicType: string[];
}