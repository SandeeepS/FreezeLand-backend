import { ICreateReport, ICreateReportResponse, IGetAllReportsResponse } from "../dataContracts/Report/IRepository";

export interface IReportRepository {
   createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
   getAllReport():Promise<IGetAllReportsResponse[] | null>
}

export default IReportRepository;