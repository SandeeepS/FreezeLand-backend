import { EmailExistResponse } from "./IService.dto";



export interface ForgotResentOtpResponse{
    success?:boolean;
    data?: EmailExistResponse;
    message?:string;
}