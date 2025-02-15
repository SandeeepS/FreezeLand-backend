// import { Types } from "mongoose";
import Mech from "../../entityInterface/Imech";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { Types } from "mongoose";
export interface SignUpMechDTO {
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface SignUpMechResponse {
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
  role: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface EmailExitCheckDTO {
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

export interface SaveMechResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: Mech;
    mechId?: string;
    token?: string;
    refresh_token?: string;
  };
}

//loging DTO and response
export interface MechLoginDTO {
  email: string;
  password: string;
}

export interface MechLoginResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: Mech;
    mechId?: string;
    token?: string;
    refresh_token?: string;
  };
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

export interface GetAllMechanicsDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetAllMechanicResponse {
  status: STATUS_CODES;
  data: {
    mech: Mech[] | null;
    mechCount: number;
  };
  message: string;
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



export interface GetPreSignedUrlDTO{

  fileName:string;
  fileType:string;
  name:string;
}

export interface GetPreSignedUrlResponse {
  success?:boolean;
  message?:string;
  uploadURL?:string;
  imageName?:string;
  key?:string;

}