import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { IServices } from "../../../models/serviceModel";
import Device from "../../entityInterface/Idevice";
import Mech from "../../entityInterface/Imech";
import User from "../../entityInterface/Iuser";
export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: STATUS_CODES;
  data: {
    success: boolean;
    message: string;
    data?: object;
    adminId?: string;
    token?: string | undefined;
    refresh_token?: string | undefined;
  };
}

export interface GetUserList {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetUserListResponse {
  status: STATUS_CODES;
  data: {
    users: User[] | null;
    usersCount: number;
  };
  message: string;
}

export interface GetMechList {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetMechListResponse {
  status: STATUS_CODES;
  data: {
    mechs: Mech[];
    mechsCount: number;
  };
  message: string;
}

export interface GetServicesDTO {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetServiceResponse {
  status: STATUS_CODES;
  data: {
    services: IServices[];
    servicesCount: number;
  };
  message: string;
}

export interface GetDeviceDTO {
  page: number;
  limit: number;
  searchQuery: string | undefined;
}

export interface GetDeviceResponse {
  status: STATUS_CODES;
  data: {
    devices: Device[];
    devicesCount: number;
  };
  message: string;
}

export interface GetServiceDTO {
  id: string;
}

export interface BlockUserDTO {
  userId: string;
}

export interface BlockMechDTO {
  mechId: string;
}

export interface BlockServiceDTO {
  _id: string;
}

export interface BlockDeviceDTO {
  _id: string;
}

export interface DeleteUserDTO {
  userId: string;
}

export interface DeleteMechDTO {
  mechId: string;
}

export interface DeleteServiceDTO {
  serviceId: string;
}

export interface DeleteDeviceDTO {
  deviceId: string;
}

export interface IsServiceExistDTO {
  name: string;
}

export interface AddserviceDTO {
  values: string;
}

export interface AddDeviceDTO {
  name: string;
}

export interface isDeviceExistDTO {
  name: string;
}

export interface EditExistServiceDTO {
  _id: string;
  values: IServices;
}
