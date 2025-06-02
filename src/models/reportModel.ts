import mongoose, { Model } from "mongoose";
import { IReport } from "../interfaces/Model/IReport";

const ReportSchema = new mongoose.Schema(
  {
    reporterRole: { type: String, enum: ["user", "mechanic"], required: true },
    targetRole: { type: String, enum: ["user", "mechanic"], required: true },
    reporterId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "role",
    },
    complaintId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Complaint",
    },
    targetId:{
        type:mongoose.Types.ObjectId,
        required:false,
    },
    reason: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const reportModel: Model<IReport> = mongoose.model<IReport>(
  "Report",
  ReportSchema
);
export default reportModel;
