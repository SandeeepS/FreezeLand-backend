// import { Types } from "mongoose";
import Mech from "../../entityInterface/Imech";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import mongoose, { Types } from "mongoose";
import Iuser from "../../entityInterface/Iuser";
import { IServices } from "../../Model/IService";
import { ILoginResponse } from "../../entityInterface/ILoginResponse";

export interface MechRegistrationData {
  name: string;
  phone: number;
  email: string;
  password: string;
  cpassword: string;
}
export interface SignUpMechDTO {
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked: boolean;
  isDeleted: boolean;
}
export interface NewDetailsDTO {
  name: string;
  password: string;
  email: string;
  phone: number;
}

export interface verifyOTPResponse {
  success: boolean;
  message: string;
  mechId?: string;
  access_token?: string;
  data?: object;
  refresh_token?: string;
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
    data?: ILoginResponse;
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
  name: string;
  id: string;
  mechanicType: string[];
  photo: string;
  adharProof: string;
  employeeLicense: string;
}

export interface GetPreSignedUrlDTO {
  fileName: string;
  fileType: string;
  name: string;
}

export interface GetPreSignedUrlResponse {
  success?: boolean;
  message?: string;
  uploadURL?: string;
  imageName?: string;
  key?: string;
}

export interface getMechanicDetailsDTO {
  id: string;
}

export interface getMechanicDetailsResponse {
  _id: Types.ObjectId | string;
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

export interface GetAllUserRegisteredServicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
  mechId: string;
}

export interface GetAllUserRegisteredServicesResponse {
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

export interface getComplaintDetailsResponse {
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
  detaultAddressDetails: object;
}

export interface getUpdatedWorkAssingnedResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  discription: string;
  locationName: object;
  status: string;
  currentMechanicId: mongoose.Types.ObjectId | null;
  acceptedAt: Date | null;
  workHistory: [
    {
      mechanicId: mongoose.Types.ObjectId;
      status: string;
      acceptedAt: Date;
      canceledAt: Date | null;
      reason: string | null;
    }
  ];
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface getAllAcceptedServiceResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  discription: string;
  locationName: object;
  status: string;
  currentMechanicId: mongoose.Types.ObjectId | null;
  acceptedAt: Date | null;
  workHistory: [
    {
      mechanicId: mongoose.Types.ObjectId;
      status: string;
      acceptedAt: Date;
      canceledAt: Date | null;
      reason: string | null;
    }
  ];
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface getMechanicDetailsDTO {
  id: string;
}

export interface getMechanicDetailsResponse {
  _id: Types.ObjectId | string;
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

export interface ICreateRoomData {
  userId: string;
  mechId: string;
}

export interface ICreateRoomResponse {
  id: string;
}

export interface IUpdateWorkDetails {
  complaintId: string;
  workDetails: object;
}

export interface IUpdatingMechanicDetails {
  mechId: string;
  values: {
    name: string;
    phone: string;
    photo: string;
  };
}

export interface IupdateingMechanicDetailsResponse{
    _id: Types.ObjectId | string;
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

export interface updateCompleteStatusResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  discription: string;
  locationName: object;
  status: string;
  currentMechanicId: mongoose.Types.ObjectId | null;
  acceptedAt: Date | null;
  workHistory: [
    {
      mechanicId: mongoose.Types.ObjectId;
      status: string;
      acceptedAt: Date;
      canceledAt: Date | null;
      reason: string | null;
    }
  ];
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetAllMechanicCompletedServicesResponse {
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
