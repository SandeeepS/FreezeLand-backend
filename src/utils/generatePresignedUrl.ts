// common function to generate presigned Url for uploading to s3 bucket 
import S3Client from "../awsConfig";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface GetPreSignedUrlResponse {
    success?:boolean;
    message?:string;
    uploadURL?:string;
    imageName?:string;
    key?:string;
  
  }

export const generatePresignedUrl = async (fileName:string,fileType:string):Promise<GetPreSignedUrlResponse> => {
    try{

 
    const imageName = uuidv4() + "-" + fileName; // Generate a unique name for the image
    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.S3_REGION;

    if (!bucketName || !region) {
      throw new Error(
        "AWS_S3_BUCKET_NAME or AWS_REGION is not defined in environment variables"
      );
    }
   
    const s3Params = {
      Bucket: bucketName,
      Key: `ServiceImages/${imageName}`,
      expires: 7200,
      ContentType: fileType,
    };
    const key = `ServiceImages/${imageName}`;
    const command = new PutObjectCommand(s3Params);
    const uploadURL = await getSignedUrl(S3Client, command);
    console.log("Presigned URL: ", uploadURL);

    // Send the presigned URL to the client
    return {
      success: true,
      uploadURL,
      imageName,
      key,
    } as GetPreSignedUrlResponse;
}catch(error){
    console.log("error occured while generaing the presinged url",error);
    return {
        success: false,
      } as GetPreSignedUrlResponse;
}
}
    