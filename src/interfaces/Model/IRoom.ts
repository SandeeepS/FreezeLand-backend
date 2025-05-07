import mongoose from "mongoose";

export interface IRoom extends Document {
    userId:mongoose.Types.ObjectId;
    mechId:mongoose.Types.ObjectId;
    createdAt:Date;
    isDeleted:boolean;
    
}