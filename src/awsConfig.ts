import dotenv from "dotenv";
import { S3Client as S3 } from "@aws-sdk/client-s3";

dotenv.config(); 

const region = process.env.S3_REGION;
const accessKeyId = process.env.S3ACCESS_KEY;
const secretAccessKey = process.env.S3SECRET_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing AWS S3 configuration in environment variables");
}

const S3Client = new S3({ 
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
});

export default S3Client;
