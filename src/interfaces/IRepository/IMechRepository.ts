
import {
    IAddService,
    EmailExistResponse,
    EmailExitCheck,
    getAllAcceptedServiceResponse,
    GetAllDevicesResponse,
   
    getComplaintDetailsResponse,
    IGetMechanicDetails,
    getMechanicDetailsResponse,
    IGetMechById,
    GetMechByIdResponse,
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
    ISaveMech,
    SaveMechResponse,
    updateCompleteStatusResponse,
    IUpdateNewPassword,
    UpdateNewPasswordResponse,
    IVerifyMechanic,
    IGetMechList,
  } from "../dataContracts/Mech/IRepository.dto";
import { ITempMech } from "../Model/IMech";

export interface IMechRepository{
    saveMechanic(mechData: ISaveMech): Promise<SaveMechResponse | null>;
    emailExistCheck(data: EmailExitCheck): Promise<EmailExistResponse | null>;
    updateNewPassword(data: IUpdateNewPassword): Promise<UpdateNewPasswordResponse | null>;
    getMechById(data:IGetMechById): Promise<GetMechByIdResponse|null> ; 
    getMechList(  data:IGetMechList): Promise<GetMechListResponse[]>; 
    getMechCount(regex: RegExp): Promise<number>; 
    verifyMechanic(values:IVerifyMechanic):Promise<unknown> 
    AddService(data:IAddService):Promise<unknown>;  
    getAllDevices(): Promise<GetAllDevicesResponse[] | null> 
    getMechanicDetails (data:IGetMechanicDetails):Promise<getMechanicDetailsResponse|null> 
    getComplaintDetails (id:string) :Promise<getComplaintDetailsResponse[]> 
    updateWorkAssigned(complaintId: string,mechanicId: string,status: string,roomId:string): Promise<getUpdatedWorkAssingnedResponse> 
    getAllAcceptedServices (mechanicId:string):Promise <getAllAcceptedServiceResponse[]>
    updateComplaintStatus(complaintId:string,nextStatus:string):Promise<updateCompleteStatusResponse | null>
    createTempMechData(tempMechDetails: {otp: string;mechData: MechRegistrationData;}): Promise<ITempMech>
    getTempMechData(id:string):Promise<ITempMech | null>
    editMechanic(mechaicDetails:IUpdatingMechanicDetails) :Promise<IupdateingMechanicDetailsResponse | null>
    addMechAddress(data: IAddMechAddress): Promise<IAddMechAddressResponse | null>
    editAddress(data: IEditAddress): Promise<IEditAddressResponse | null>
    updateTempMechData(data: IUpdateTempDataWithOTP): Promise<ITempMech | null> 
    updateMechanicEarnings(updateMechanicDetails:IUpdateMechanicDetails):Promise<IUpdatedMechnicDetails | null>
    handleRemoveMechAddress(mechId: string,addressId: string): Promise<boolean>
}