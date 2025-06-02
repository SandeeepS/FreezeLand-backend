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
  reason: string;
  description: string;
  isDeleted: boolean;
}
