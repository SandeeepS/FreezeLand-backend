import  mongoose, { Types } from "mongoose";
import Iuser from "../../entityInterface/Iuser";
import { IServices } from "../../Model/IService";
import { Address } from "../../Model/IMech";
import { AddAddress } from "../../commonInterfaces/AddAddress";

export interface MechRegistrationData {
  name: string;
  phone: number;
  email: string;
  password: string;
  cpassword: string;
}

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
  search:string;
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
  detaultAddressDetails:object;
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


export interface IAddMechAddress {
  _id: string;
  values: Address;
}

export interface IAddMechAddressResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  mechanicType: string[];
  photo: string;
  adharProof: string;
  employeeLicense: string;
  locationData: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: number[]; // [longitude, latitude]
    city: string;
    state: string;
  };
  address: Address[];
  defaultAddress: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IEditAddress {
  _id: string;
  addressId: string;
  values: AddAddress;
}
export interface IEditAddressResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  mechanicType: string[];
  photo: string;
  adharProof: string;
  employeeLicense: string;
  locationData: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: number[]; // [longitude, latitude]
    city: string;
    state: string;
  };
  address: Address[];
  defaultAddress: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface getUpdatedWorkAssingnedResponse{
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
  id:string;
}

export interface getMechanicDetailsResponse {
  _id:Types.ObjectId | string;
  name: string;
  email: string;
  phone: number;
  role: string;
  photo: string ;
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

