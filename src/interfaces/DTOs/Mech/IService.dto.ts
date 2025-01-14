// import { Types } from "mongoose";
import Mech from "../../entityInterface/Imech";

export interface SignUpMechDTO {
      name: string;
      email: string;
      password: string;
      phone: number;
      isBlocked: boolean;
      isDeleted:boolean;
}

export interface SaveMechDTO {
    id?:string;
    name: string;
    email: string;
    password: string;
    phone: number;
    isBlocked?:boolean;
    isDeleted?:boolean;
}

//loging DTO and response 
export interface MechLoginDTO {
    email:string;
    password:string;
}

export interface MechLoginResponse{
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
    password:string;
    userId:string;
}


