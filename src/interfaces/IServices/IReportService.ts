import { ICreateReport, ICreateReportResponse } from "../DTOs/Report/IService";


export interface IReportService {
    createReport(reportData:ICreateReport):Promise<ICreateReportResponse | null>
}

export default IReportService;