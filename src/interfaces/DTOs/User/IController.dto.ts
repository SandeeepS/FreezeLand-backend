import User from "../../entityInterface/Iuser";
import { EmailExistCheckResponse } from "./IService.dto";

export interface UserSignUpDTO{
  
    email:string,
    name:string,
    phone:number,
    password:string,
    cpassword:string,
      
}

export interface GetPreSignedUrlResponse {
    success?:boolean;
    message?:string;
    uploadURL?:string;
    imageName?:string;
    key?:string;

}

export interface ReturnUserdataDTO {
    _id: string;
    name: string;
    email: string;
    phone: number;
    role: string;
    isDeleted: boolean;
    isBlocked: boolean;
    profile_picture: string;
  }

  export interface EmailExistCheckDTO {
    id: string;
    name: string;
    email: string;
    phone: number;
    password?: string;
    profile_picture: string;
    role: string;
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



export interface ISaveUser {
    name:string;
    email:string;
    password:string;
}

export interface SaveUserResponse{
    success:boolean;
    message:string;
    userId?:string;
    data?:User ;
    token?:string | undefined;
    refresh_token?:string | undefined;
}

export interface EditUserDTO {
    _id:string;
    name:string;
    phone:number;
    profile_picture:string;
}

export interface ForgotResentOtpResponse{
    success?:boolean;
    data?: EmailExistCheckResponse;
    message?:string;
}

export interface GetImageUrlResponse{
    success?:boolean;
    message?:string;
    url?:string;
}

export interface VerifyForgotOtpMech{
    success?:boolean;
    message?:string;
    url?:string;
}