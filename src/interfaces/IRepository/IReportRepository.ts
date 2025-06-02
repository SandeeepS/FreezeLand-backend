import { ICreateReport, ICreateReportResponse } from "../DTOs/Report/IRepository";

export interface IReportRepository {
   createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
}

export default IReportRepository;