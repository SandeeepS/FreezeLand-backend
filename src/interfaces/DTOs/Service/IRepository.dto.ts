import { Types } from "mongoose";

export interface GetServiceDTO {
  id: string;
}

export interface GetServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}