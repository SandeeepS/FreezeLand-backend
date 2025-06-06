
import { IAddMechAddressResponse } from "../DTOs/Mech/IRepository.dto";
import {
    EmailExistResponse,
    EmailExitCheckDTO,
    getAllAcceptedServiceResponse,
    GetAllDevicesResponse,
    GetAllMechanicCompletedServicesResponse,
    GetAllMechanicResponse,
    GetAllMechanicsDTO,
    getComplaintDetailsResponse,
    getMechanicDetailsDTO,
    getMechanicDetailsResponse,
    GetPreSignedUrlDTO,
    GetPreSignedUrlResponse,
    getUpdatedWorkAssingnedResponse,
    IAddMechAddress,
    ICreateRoomData,
    ICreateRoomResponse,
    IEditAddress,
    IEditAddressResponse,
    IResendOTPData,
    IupdateingMechanicDetailsResponse,
    IUpdateWorkDetails,
    IUpdatingMechanicDetails,
    MechLoginDTO,
    MechLoginResponse,
    MechRegistrationData,
    SaveMechDTO,
    SaveMechResponse,
    SignUpMechDTO,
    SignUpMechResponse,
    updateCompleteStatusResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
    VerifyMechanicDTO,
    verifyOTPResponse,
  } from "../DTOs/Mech/IService.dto";
import { ITempMech } from "../Model/IMech";


export interface IMechServices{
    mechRegistration( mechData: MechRegistrationData): Promise<Partial<ITempMech>>
    verifyOTP(id: string, otp: string): Promise<verifyOTPResponse>
    signupMech(mechData: SignUpMechDTO): Promise<SignUpMechResponse | null>;
    saveMech(mechData: SaveMechDTO): Promise<SaveMechResponse> ;
    mechLogin(data: MechLoginDTO): Promise<MechLoginResponse>;
    getUserByEmail(data: EmailExitCheckDTO):Promise<EmailExistResponse | null>;
    getAllMechanics(data: GetAllMechanicsDTO): Promise<GetAllMechanicResponse | null>;
    VerifyMechanic (values:VerifyMechanicDTO):Promise<unknown>
    updateNewPassword(data: UpdateNewPasswordDTO):Promise<UpdateNewPasswordResponse | null>;
    getAllUserRegisteredServices(page: number, limit: number, searchQuery: string,userId:string): Promise<unknown>;
    getComplaintDetails(id:string) :Promise<getComplaintDetailsResponse[] | null >
    getAllAcceptedServices (mechanicId : string) : Promise<getAllAcceptedServiceResponse[]>
    updateWorkDetails(data : IUpdateWorkDetails ) :Promise<unknown>
    getDevcies(): Promise<GetAllDevicesResponse[]>
    getMechanicDetails(data: getMechanicDetailsDTO): Promise<getMechanicDetailsResponse | null> 
    getS3SingUrlForMechCredinential(data: GetPreSignedUrlDTO):Promise<GetPreSignedUrlResponse> 
    updateWorkAssigned(complaintId: string,mechanicId: string,status: string,roomId: string): Promise<getUpdatedWorkAssingnedResponse> 
    updateComplaintStatus(complaintId: string, nextStatus: string):Promise<updateCompleteStatusResponse | null>   
    createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> 
    getAllCompletedServices (mechanicId:string):Promise<GetAllMechanicCompletedServicesResponse[] | null>
    editMechanic(mechaicDetails:IUpdatingMechanicDetails) :Promise<IupdateingMechanicDetailsResponse | null> 
    AddUserAddress(data: IAddMechAddress): Promise<IAddMechAddressResponse | null> 
    editAddress(data: IEditAddress): Promise<IEditAddressResponse | null> 
    resendOTP(data: IResendOTPData): Promise<Partial<ITempMech> | null>
    handleRemoveMechAddress(mechId: string,addressId:string): Promise<boolean>
}

