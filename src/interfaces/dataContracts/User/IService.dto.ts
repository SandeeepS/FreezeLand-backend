import Iuser from "../../entityInterface/Iuser";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { AddAddress } from "../../commonInterfaces/AddAddress";
import Service from "../../entityInterface/Iservices";
import mongoose, { Types } from "mongoose";
import { ITempUser } from "../../Model/IUser";
import { ILoginResponse } from "../../entityInterface/ILoginResponse";
import { IOrderData } from "../Order/IRepository";

export interface ISingUp {
  name: string;
  phone: number;
  email: string;
  password: string;
  cpassword: string;
}

export interface IUserSignUp {
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
}

export interface IGetPreSignedUrl {
  fileName: string;
  fileType: string;
  folderName: string;
}

export interface GetPreSignedUrlResponse {
  success?: boolean;
  message?: string;
  uploadURL?: string;
  imageName?: string;
  key?: string;
}

export interface getMechanicDetailsResponse {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  phone: number;
  role: string;
  profile_picture: string;
  adharProof: string | null;
  employeeLicense: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  mechanicType: string[];
}

export interface IGetMechanicDetails {
  id: string;
}

export interface UserSignUpResponse extends Document {
  userData: Partial<ITempUser>;
  otp: string;
  createdAt: Date;
}

export interface IResendOTPData {
  tempUserId: string;
}

// export interface IResendOTPResponse {

// }
export interface UserLoginResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: ILoginResponse;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface ISaveUser {
  id?: string;
  name: string;
  email: string;
  phone?: number;
  password: string;
  profile_picture: string;
}

export interface SaveUserResponse {
  success: boolean;
  message: string;
  userId?: string;
  data?: Iuser;
  token?: string | undefined;
  refresh_token?: string | undefined;
}

export interface IGetService {
  id: string;
}

export interface GetServiceResponse2 {
  id?: Types.ObjectId;
  name: string;
  imageKey: string;
  discription: string[];
  serviceCharge: number;
  createdAt: Date;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IUserLogin {
  email: string;
  password: string;
  role: string;
}

export interface IReturnUserdata {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: string;
  isDeleted: boolean;
  isBlocked: boolean;
  profile_picture: string;
}

export interface INewDetails {
  name: string;
  password: string;
  email: string;
  phone: number | undefined;
}

export interface IEmailExistCheck {
  id: string;
  name: string;
  email: string;
  phone: number;
  password?: string;
  profile_picture: string;
  role: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface EmailExistCheckResponse {
  id: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  address: {
    name: string;
    phone: number;
    email: string;
    state: string;
    pin: number;
    district: string;
    landMark: string;
  }[];
  defaultAddress: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IGetProfile {
  id: string;
}

export interface GetProfileResponse {
  status: STATUS_CODES;
  data: {
    success: boolean;
    message: string;
    data?: Iuser;
  };
}

export interface verifyOTPResponse {
  success: boolean;
  message: string;
  userId?: string;
  token?: string;
  data?: object;
  refresh_token?: string;
}

export interface IGetServices {
  page: number;
  limit: number;
  searchQuery: string | undefined;
  search:string
}

export interface IUpdateNewPassword {
  password: string;
  userId: string;
}

export interface UpdateNewPasswordResponse {
  id?: string;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface GetServiceResponse {
  status: STATUS_CODES;
  data: {
    services: Service[] | null;
    servicesCount: number;
  };
  message: string;
}

export interface IEditUser {
  _id: string;
  name: string;
  phone: number;
  profile_picture: string;
}

export interface EditUserResponse {
  id?: string;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IAddress {
  _id?:string;
  userId: string;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber: string;
  landMark: string;
  latitude: number;
  longitude: number;
}

export interface AddUserAddress {
  values: IAddress;
}

export interface AddUserAddressResponse {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber: string;
  longitude: number;
  latitude: number;
  landmark: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

export interface IEditAddress {
  _id: string;
  addressId: string;
  values: AddAddress;
}
export interface EditAddressResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ISetUserDefaultAddress {
  userId: string;
  addressId: string;
}

export interface SetUserDefaultAddressResponse {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber: string;
  longitude: number;
  latitude: number;
  landmark: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

export interface GetUserByEmail {
  email: string;
}

export interface IGenerateToken {
  payload: string | undefined;
}

export interface GenerateRefreshToken {
  payload: string | undefined;
}

export interface IRegisterService {
  _id: Types.ObjectId;
  name: string;
  image: [];
  serviceId: Types.ObjectId;
  userId: Types.ObjectId;
  address: Types.ObjectId;
  discription: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface ILocationData {
  type: {
    type: string;
    enum: string[];
    default: string;
  };
  coordinates: number[];
  city: string;
  state: string;
}
export interface IupdateUserLocation {
  userId: string;
  locationData: ILocationData;
}

export interface IupdateUserLocationResponse {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  profile_picture: string;
  role: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface getAllAddressOfUserResponse {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  addressType: "Home" | "Work";
  fullAddress: string;
  houseNumber: string;
  longitude: number;
  latitude: number;
  landmark: string;
  isDeleted: boolean;
  isDefaultAddress: boolean;
}

export interface IPaymentData {
  complaintId: string;
  status: string;
  mechanicId: string;
  amount: number;
  serviceId: string;
}

export interface ISuccessPaymentResponse {
  status: string;
  message: string;
  data: {
    status: string;
    message: string;
    data: IOrderData;
  };
}

export interface RegisterServiceResponse {
  _id: Types.ObjectId;
  name: string;
  image: [];
  serviceId: Types.ObjectId;
  userId: Types.ObjectId;
  address: Types.ObjectId;
  discription: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface getUserRegisteredServiceDetailsByIdResponse {
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
}
