import { UserInterface } from "../../../models/userModel";
import User from "../../entityInterface/Iuser";
export interface UserSignUpDTO {
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
}

export interface UserSignUpResponse{
    status: number;
    data: {
      success: boolean;
      message: string;
      data?: UserInterface;
      userId?: string;
      token?: string;
      refresh_token?: string;
    };
}

export interface UserLoginResponse{
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: User;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface SaveUserDTO {
  id?:string;
  name: string;
  email: string;
  phone?: number;
  password: string;
  profile_picture:string

}

export interface SaveUserResponse{
  success:boolean;
  message:string;
  userId?:string;
  data?:User ;
  token?:string | undefined;
  refresh_token?:string | undefined;
}

export interface UserLoginDTO {
    email:string,
    password:string
}

export interface NewDetailsDTO{
  name:string;
  password:string;
  email:string;
  phone:number | undefined;
}

export interface EmailExistCheckDTO{
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



