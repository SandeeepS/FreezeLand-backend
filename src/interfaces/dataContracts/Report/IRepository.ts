import mongoose from "mongoose";

export interface ICreateReport {
  reason: string;
  discription: string;
  reporterRole: "user" | "mechanic";
  targetId: string;
  targetRole: "mechanic" | "user" | "service";
  reporterId: string;
  targetName: string;
  complaintId: string;
}

export interface ICreateReportResponse {
  _id?: mongoose.Types.ObjectId;
  reporterRole: string;
  targetRole: string;
  reporterId: mongoose.Types.ObjectId;
  complaintId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  status:string
  reason: string;
  description: string;
  isDeleted: boolean;
}
export interface IGetAllReportsResponse {
  _id?: mongoose.Types.ObjectId;
  reporterRole: string;
  targetRole: string;
  reporterId: mongoose.Types.ObjectId;
  complaintId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  status:string;
  reason: string;
  description: string;
  isDeleted: boolean;
}

export interface IUpdateReportStatus {
  reportId:string;
  status:string;
}

export interface IUpdateReportStatusResponse {
      reporterRole:string,
      targetRole:string,
      reporterId:mongoose.Types.ObjectId,
      complaintId:mongoose.Types.ObjectId,
      targetId:mongoose.Types.ObjectId,
      status:string,
      reason:string,
      description:string,
      isDeleted:boolean
}