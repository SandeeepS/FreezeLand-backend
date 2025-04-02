export interface GetPreSignedUrlResponse {
    success?:boolean;
    message?:string;
    uploadURL?:string;
    imageName?:string;
    key?:string;

}

export interface GetImageUrlResponse{
    success?:boolean;
    message?:string;
    url?:string;
}