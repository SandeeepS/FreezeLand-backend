import { Types } from "mongoose";
import User from "../../entityInterface/Iuser";

export interface UserSignUpDTO{
  
    email:string,
    name:string,
    phone:number,
    password:string,
    cpassword:string,
      
}

export interface UserResponseDTO{
    
    
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