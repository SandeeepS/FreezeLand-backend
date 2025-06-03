import {
  ICreateReport,
  ICreateReportResponse,
  IGetAllReportsResponse,
} from "../interfaces/DTOs/Report/IService";
import IReportRepository from "../interfaces/IRepository/IReportRepository";
import IReportService from "../interfaces/IServices/IReportService";

class ReportService implements IReportService {
  constructor(private reportRepository: IReportRepository) {
    this.reportRepository = reportRepository;
  }

  async createReport(
    reportData: ICreateReport
  ): Promise<ICreateReportResponse | null> {
    try {
      console.log(
        "Entered in the createReport function in the report service "
      );
      const result = await this.reportRepository.createReport(reportData);
      return result;
    } catch (error) {
      console.log("Error while creating report in the reportService", error);
      throw error;
    }
  }

  async getAllReportByReporterRole(
    reporterRole: string
  ): Promise<IGetAllReportsResponse[] | null> {
    try {
      console.log("Entered in the reportService for fechting all reports ");
      const result = await this.reportRepository.getAllReport();
      if (result) {
        const filteredReports = result.filter(
          (report) => report.reporterRole === reporterRole
        );

        return filteredReports;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error occured while getAllReporst ", error);
      throw error;
    }
  }
}

export default ReportService;
