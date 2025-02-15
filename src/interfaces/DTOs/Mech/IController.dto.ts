import { EmailExistResponse } from "./IService.dto";



export interface ForgotResentOtpResponse{
    success?:boolean;
    data?: EmailExistResponse;
    message?:string;
}

export interface GetPreSignedUrlResponse {
    success?:boolean;
    message?:string;
    uploadURL?:string;
    imageName?:string;
    key?:string;

}