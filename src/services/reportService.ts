import { ICreateReport, ICreateReportResponse } from "../interfaces/DTOs/Report/IService";
import IReportRepository from "../interfaces/IRepository/IReportRepository";
import IReportService from "../interfaces/IServices/IReportService";

class ReportService implements IReportService {
  constructor(private reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>{
    try{
        console.log("Entered in the createReport function in the report service ");
        const result = await this.reportRepository.createReport(reportData);
        return result;
    }catch(error){
        console.log("Error while creating report in the reportService",error);
        throw error;
    }
  }

}

export default ReportService;
