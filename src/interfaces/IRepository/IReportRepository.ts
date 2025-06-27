import { ICreateReport, ICreateReportResponse, IGetAllReportsResponse, IUpdateReportStatus, IUpdateReportStatusResponse } from "../dataContracts/Report/IRepository";

export interface IReportRepository {
   createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
   getAllReport():Promise<IGetAllReportsResponse[] | null>
   updateReportStatus( data : IUpdateReportStatus ) : Promise <IUpdateReportStatusResponse | null> 
}

export default IReportRepository;