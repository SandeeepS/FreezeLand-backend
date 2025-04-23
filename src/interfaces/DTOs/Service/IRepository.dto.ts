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

export interface GetAllServicesDTO {
  page: number;
  limit: number;
  searchQuery: string;
  search:string;

}

export interface GetAllServiceResponse {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge:number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetServiceCountDTO {
  searchQuery: string;
}
