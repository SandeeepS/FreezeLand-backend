import { Types } from "mongoose";

export interface IGetService {
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

export interface IGetAllServices {
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

export interface IGetServiceCount{
  searchQuery: string;
}
