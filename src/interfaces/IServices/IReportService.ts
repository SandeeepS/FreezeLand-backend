import { ICreateReport, ICreateReportResponse, IGetAllReportsResponse } from "../dataContracts/Report/IService";


export interface IReportService {
    createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
    getAllReportByReporterRole(reporterRole:string) : Promise<IGetAllReportsResponse[] | null>
}

export default IReportService;