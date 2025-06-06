
import {
    AddServiceDTO,
    EmailExistResponse,
    EmailExitCheck,
    getAllAcceptedServiceResponse,
    GetAllDevicesResponse,
   
    getComplaintDetailsResponse,
    getMechanicDetailsDTO,
    getMechanicDetailsResponse,
    GetMechByIdDTO,
    GetMechByIdResponse,
    GetMechListDTO,
    GetMechListResponse,
    getUpdatedWorkAssingnedResponse,
    IAddMechAddress,
    IAddMechAddressResponse,
    IEditAddress,
    IEditAddressResponse,
    IUpdatedMechnicDetails,
    IupdateingMechanicDetailsResponse,
    IUpdateMechanicDetails,
    IUpdateTempDataWithOTP,
    IUpdatingMechanicDetails,
    MechRegistrationData,
    SaveMechDTO,
    SaveMechResponse,
    updateCompleteStatusResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
    VerifyMechanicDTO,
  } from "../DTOs/Mech/IRepository.dto";
import { ITempMech } from "../Model/IMech";

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
    getComplaintDetails (id:string) :Promise<getComplaintDetailsResponse[]> 
    updateWorkAssigned(complaintId: string,mechanicId: string,status: string,roomId:string): Promise<getUpdatedWorkAssingnedResponse> 
    getAllAcceptedServices (mechanicId:string):Promise <getAllAcceptedServiceResponse[]>
    updateComplaintStatus(complaintId:string,nextStatus:string):Promise<updateCompleteStatusResponse | null>
    createTempMechData(tempMechDetails: {otp: string;mechData: MechRegistrationData;}): Promise<ITempMech>
    getTempMechData(id:string):Promise<ITempMech | null>
    editMechanic(mechaicDetails:IUpdatingMechanicDetails) :Promise<IupdateingMechanicDetailsResponse | null>
    addAddress(data: IAddMechAddress): Promise<IAddMechAddressResponse | null>
    editAddress(data: IEditAddress): Promise<IEditAddressResponse | null>
    updateTempMechData(data: IUpdateTempDataWithOTP): Promise<ITempMech | null> 
    updateMechanicEarnings(updateMechanicDetails:IUpdateMechanicDetails):Promise<IUpdatedMechnicDetails | null>
    handleRemoveMechAddress(mechId: string,addressId: string): Promise<boolean>
}