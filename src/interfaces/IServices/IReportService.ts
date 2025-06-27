import { ICreateReport, ICreateReportResponse, IGetAllReportsResponse, IUpdateReportStatus, IUpdateReportStatusResponse } from "../dataContracts/Report/IService";


export interface IReportService {
    createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
    getAllReportByReporterRole(reporterRole:string) : Promise<IGetAllReportsResponse[] | null>
     updateReportStatus( data : IUpdateReportStatus ) : Promise <IUpdateReportStatusResponse | null>
}

export default IReportService;