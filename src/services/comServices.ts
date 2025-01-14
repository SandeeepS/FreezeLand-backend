import { UserLoginDTO, UserLoginResponse } from "../interfaces/DTOs/User/IService.dto";

export interface comService<T>{
    adminLogin?(email:string,password:string):Promise<T | null>;
    singupMech?(mechData:string):Promise<T | null>;
    mechLogin?(email:string,password:string):Promise<T | null>;
    singupUser?(userData:string):Promise<T | null>;
    userLogin?(userData:UserLoginDTO):Promise<UserLoginResponse>;
    getProfile?(id:string | undefined):Promise<T | null> | null;
}

