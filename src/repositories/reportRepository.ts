import mongoose from "mongoose";
import {
  ICreateReport,
  ICreateReportResponse,
  IGetAllReportsResponse,
  IUpdateReportStatus,
  IUpdateReportStatusResponse,
} from "../interfaces/dataContracts/Report/IRepository";
import IReportRepository from "../interfaces/IRepository/IReportRepository";
import { IReport } from "../interfaces/Model/IReport";
import reportModel from "../models/reportModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class ReportRepository
  extends BaseRepository<IReport & Document>
  implements IReportRepository
{
  constructor() {
    super(reportModel);
  }

  async createReport(
    reportData: ICreateReport
  ): Promise<ICreateReportResponse | null> {
    try {
      const { reporterId, complaintId, targetId } = reportData;

      if (
        !mongoose.Types.ObjectId.isValid(reporterId) ||
        !mongoose.Types.ObjectId.isValid(complaintId) ||
        !mongoose.Types.ObjectId.isValid(targetId)
      ) {
        throw new Error("Invalid ObjectId passed in reportData");
      }
      console.log(
        "Entered in the createReport function in the reportRepository"
      );
      const objReportId = new mongoose.Types.ObjectId(reporterId);
      const objComplaintId = new mongoose.Types.ObjectId(complaintId);
      const objtargetId = new mongoose.Types.ObjectId(targetId);
      const reportToSave = {
        ...reportData,
        complaintId: objComplaintId,
        reporterId: objReportId,
        targetId: objtargetId,
      };
      const result = await this.save(reportToSave);
      return result;
    } catch (error) {
      console.log(
        "Error occurd while creating the createReport function in the reportRepository",
        error
      );
      throw error;
    }
  }

  async getAllReport(): Promise<IGetAllReportsResponse[] | null> {
    try {
      console.log(
        "Entered in the getAllReport function in the reportRepository"
      );
      const result = await this.findAll2();
      console.log("Reult after getting the report from the databse is", result);
      return result;
    } catch (error) {
      console.log(
        "Error occurd while creating the createReport function in the reportRepository",
        error
      );
      throw error;
    }
  }

  //function to updating the existing report status
  async updateReportStatus(
    data: IUpdateReportStatus
  ): Promise<IUpdateReportStatusResponse | null> {
    try {
      const { reportId, status } = data;
      const response = await reportModel.findByIdAndUpdate(reportId, {
        status: status,
      });

      return response;
    } catch (error) {
      console.log(
        "error occured while updating the report in the updateReportService in the report Service.ts ",
        error
      );
      throw error;
    }
  }
}

export default ReportRepository;
