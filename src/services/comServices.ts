import { AdminLoginDTO } from "../interfaces/DTOs/Admin/IService.dto";
import { MechLoginDTO } from "../interfaces/DTOs/Mech/IService.dto";
import { GetProfileDTO, UserLoginDTO, UserLoginResponse } from "../interfaces/DTOs/User/IService.dto";

export interface comService<T>{
    adminLogin?(data:AdminLoginDTO):Promise<T | null>;
    singupMech?(mechData:string):Promise<T | null>;
    mechLogin?(data:MechLoginDTO):Promise<T | null>;
    singupUser?(userData:string):Promise<T | null>;
    userLogin?(userData:UserLoginDTO):Promise<UserLoginResponse>;
    getProfile?(data:GetProfileDTO):Promise<T | null> | null;
}

