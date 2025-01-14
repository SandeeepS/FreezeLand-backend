import { AddAddress } from "../../commonInterfaces/AddAddress";
import { Types } from "mongoose";

export interface EmailExistCheckDTO {
    email:string,
}

export interface EmailExistCheckResponse{
    id?: string;
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
    defaultAddress:string;
    isBlocked: boolean;
    isDeleted: boolean;
}

export interface EditUserDTO {
    _id:string;
    name:string;
    phone:number;
  }

export interface EditUserResponse{
    id?: string;
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
    defaultAddress:string;
    isBlocked: boolean;
    isDeleted: boolean;
}

export interface AddUserAddressDTO {
  _id:string;
  values: AddAddress;
}

export interface AddUserAddressResponse{
    name:string,
    phone:number,
    email:string,
    state?:string,
    pin?:number,
    district?:string,
    landMark?:string
}

export interface EditAddressDTO{
    _id:string;
    addressId:string;
    values:AddAddress;
  }

  export interface SetUserDefaultAddressDTO {
    userId:string;
    addressId:string;
  }

export interface RegisterServiceDTO {
    _id: Types.ObjectId ;
    name: string;
    image: [];
    service: Types.ObjectId;
    defaultAddress: Types.ObjectId;
    discription: string;
    locationName: object;
    isBlocked: boolean;
    isDeleted: boolean;
}

