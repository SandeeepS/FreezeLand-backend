import mongoose from "mongoose";

export interface IReport extends Document{
    reporterRole:string,
    targetRole:string,
    reporterId:mongoose.Types.ObjectId,
    complaintId:mongoose.Types.ObjectId,
    targetId:mongoose.Types.ObjectId,
    reason:string,
    description:string,
    isDeleted:boolean
}

