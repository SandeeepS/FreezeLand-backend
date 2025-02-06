// import { Types } from "mongoose";
import Mech from "../../entityInterface/Imech";
import { STATUS_CODES } from "../../../constants/httpStatusCodes";
import { MechInterface } from "../../../models/mechModel";
export interface SignUpMechDTO {
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface SaveMechDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

//loging DTO and response
export interface MechLoginDTO {
  email: string;
  password: string;
}

export interface MechLoginResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: Mech;
    mechId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface UpdateNewPasswordDTO {
  password: string;
  userId: string;
}

export interface GetAllMechanicsDTO {
  page: number;
  limit: number;
  searchQuery: string;
}

export interface GetAllMechanicResponse {
  status: STATUS_CODES;
  data: {
    mech: MechInterface[] | null;
    mechCount: number;
  };
  message: string;
}
