
import {
    AddServiceDTO,
    EmailExistResponse,
    EmailExitCheck,
    getAllAcceptedServiceResponse,
    GetAllDevicesResponse,
    GetAllUserRegisteredServicesDTO,
    GetAllUserRegisteredServicesResponse,
    getComplaintDetailsResponse,
    getMechanicDetailsDTO,
    getMechanicDetailsResponse,
    GetMechByIdDTO,
    GetMechByIdResponse,
    GetMechListDTO,
    GetMechListResponse,
    getUpdatedWorkAssingnedResponse,
    SaveMechDTO,
    SaveMechResponse,
    updateCompleteStatusResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
    VerifyMechanicDTO,
  } from "../DTOs/Mech/IRepository.dto";

export interface IMechRepository{
    saveMechanic(mechData: SaveMechDTO): Promise<SaveMechResponse | null>;
    emailExistCheck(data: EmailExitCheck): Promise<EmailExistResponse | null>;
    updateNewPassword(data: UpdateNewPasswordDTO): Promise<UpdateNewPasswordResponse | null>;
    getMechById(data:GetMechByIdDTO): Promise<GetMechByIdResponse|null> ; 
    getMechList(  data:GetMechListDTO): Promise<GetMechListResponse[]>; 
    getMechCount(regex: RegExp): Promise<number>; 
    verifyMechanic(values:VerifyMechanicDTO):Promise<unknown> 
    AddService(data:AddServiceDTO):Promise<unknown>;  
    getAllDevices(): Promise<GetAllDevicesResponse[]> 
    getMechanicDetails (data:getMechanicDetailsDTO):Promise<getMechanicDetailsResponse|null> 
    getAllUserRegisteredServices(data: GetAllUserRegisteredServicesDTO): Promise<GetAllUserRegisteredServicesResponse[]|null> 
    getComplaintDetails (id:string) :Promise<getComplaintDetailsResponse[]> 
    updateWorkAssigned(complaintId: string,mechanicId: string,status: string): Promise<getUpdatedWorkAssingnedResponse> 
    getAllAcceptedServices (mechanicId:string):Promise <getAllAcceptedServiceResponse[]>
    updateComplaintStatus(complaintId:string,nextStatus:string):Promise<updateCompleteStatusResponse | null>

}