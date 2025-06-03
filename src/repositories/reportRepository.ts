import mongoose from "mongoose";
import { ICreateReport, ICreateReportResponse } from "../interfaces/DTOs/Report/IRepository";
import IReportRepository from "../interfaces/IRepository/IReportRepository";
import { IReport } from "../interfaces/Model/IReport";
import reportModel from "../models/reportModel";
import { BaseRepository } from "./BaseRepository/baseRepository";


class ReportRepository extends BaseRepository<IReport & Document > implements IReportRepository {
        constructor(){
            super(reportModel)
        }

        async createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>{
            try{
                console.log("Entered in the createReport function in the reportRepository");
                const objReportId = new mongoose.Types.ObjectId(reportData.reporterId);
                const objComplaintId = new mongoose.Types.ObjectId(reportData.complaintId);
                const objtargetId = new mongoose.Types.ObjectId(reportData.targetId);
                const reportToSave = {
                    ...reportData,
                    complaintId: objComplaintId,
                    reporterId: objReportId,
                    targetId: objtargetId
                };
                const result = await this.save(reportToSave);
                return result;
            }catch(error){
                console.log("Error occurd while creating the createReport function in the reportRepository",error);
                throw error;
            }
        }
}

export default ReportRepository;