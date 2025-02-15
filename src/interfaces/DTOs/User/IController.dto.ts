import User from "../../entityInterface/Iuser";
import { EmailExistCheckResponse } from "./IService.dto";

export interface UserSignUpDTO{
  
    email:string,
    name:string,
    phone:number,
    password:string,
    cpassword:string,
      
}



export interface SaveUserDTO {
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