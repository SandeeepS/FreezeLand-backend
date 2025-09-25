import mongoose from "mongoose";
import Iuser from "../../entityInterface/Iuser";
import { IServices } from "../../Model/IService";

export interface getComplaintDetailsResponse {
    _id: string;
    name: string;
    image: [];
    serviceId: string;
    userId: string;
    defaultAddress: string;
    discription: string;
    locationName: object;
    isBlocked: boolean;
    isDeleted: boolean;
    userDetails: object;
    serviceDetails: object;
    detaultAddressDetails:object;
  }

  export interface IUpdateWorkDetails{
    complaintId:string;
    workDetails:object;
  }
  
  export interface IGetAllUserRegisteredServices {
  page: number;
  limit: number;
  searchQuery: string;
}


export interface GetAllUserRegisteredServicesResponse {
  _id: string ;
  name: string;
  image: [];
  serviceId: string;
  userId:string;
  defaultAddress: string;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails:Iuser;
  serviceDetails:IServices;
}


export interface GetAllMechanicCompletedServicesResponse {
  _id: string ;
  name: string;
  image: [];
  serviceId: string;
  userId:string;
  defaultAddress: string;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;
  userDetails:Iuser;
  serviceDetails:IServices;
}

export interface UpdatedcomplaintWithOrderIdResponse {
   _id:  mongoose.Types.ObjectId ;
  name: string;
  image: [];
  serviceId:  mongoose.Types.ObjectId  ;
  userId: mongoose.Types.ObjectId ;
  defaultAddress:  mongoose.Types.ObjectId ;
  discription: string;
  locationName: object;
  isBlocked: boolean;
  isDeleted: boolean;


}
export interface RegisterServiceResponse  {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: [];
  serviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  defaultAddress: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId; 
  discription: string;
  locationName: object;
  status: string; 
  currentMechanicId: mongoose.Types.ObjectId | null; 
  acceptedAt: Date; 
  workHistory: [
    {
      mechanicId: mongoose.Types.ObjectId;
      status: string;
      acceptedAt: Date;
      canceledAt: Date;
      reason: string;
      canceledBy: string;
    }
  ]; 

  userCancellation: {
    canceledAt: Date;
    reason: string;
  }; 

  needsReassignment: boolean; 
  workDetails: [
    {
      description: string;
      amount: number;
      addedAt: Date;
    }
  ];
  chatId?: mongoose.Types.ObjectId;

  isBlocked: boolean;
  isDeleted: boolean;
}



  export interface IAllComplaintDataResponse {
    _id: mongoose.Types.ObjectId;
    name: string;
    image: [];
    serviceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    defaultAddress: mongoose.Types.ObjectId;
    discription: string;
    locationName: object;
    status: string;
    currentMechanicId: mongoose.Types.ObjectId | null;
    acceptedAt: Date | null;
    workHistory: [
      {
        mechanicId: mongoose.Types.ObjectId;
        status: string;
        acceptedAt: Date;
        canceledAt: Date | null;
        reason: string | null;
      }
    ];

    workDetails: [
      {
        description: string;
        amount: number;
        addedAt: Date;
      }
    ];
    chatId?: mongoose.Types.ObjectId; //here the chat id referes to the room id .
    isBlocked: boolean;
    isDeleted: boolean;
  }
  