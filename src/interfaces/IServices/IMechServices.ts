
import { IAddMechAddressResponse, SetMechDefaultAddressResponse } from "../dataContracts/Mech/IRepository.dto";
import {
    EmailExistResponse,
    IEmailExitCheck,
    getAllAcceptedServiceResponse,
    GetAllDevicesResponse,
    GetAllMechanicCompletedServicesResponse,
    GetAllMechanicResponse,
    IGetAllMechanics,
    getComplaintDetailsResponse,
    IGetMechanicDetails,
    getMechanicDetailsResponse,
    IGetPreSignedUrl,
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
    IMechLogin,
    MechLoginResponse,
    MechRegistrationData,
    ISaveMech,
    SaveMechResponse,
    ISignUpMech,
    SignUpMechResponse,
    updateCompleteStatusResponse,
    IUpdateNewPassword,
    UpdateNewPasswordResponse,
    IVerifyMechanic,
    verifyOTPResponse,
    IGetMechanicAddress,
    IGetMechanicAddressResponse,
    ISetMechDefaultAddress,
  } from "../dataContracts/Mech/IService.dto";
import { ITempMech } from "../Model/IMech";

export interface IMechServices{
    mechRegistration( mechData: MechRegistrationData): Promise<Partial<ITempMech>>
    verifyOTP(id: string, otp: string): Promise<verifyOTPResponse>
    signupMech(mechData: ISignUpMech): Promise<SignUpMechResponse | null>;
    saveMech(mechData: ISaveMech): Promise<SaveMechResponse> ;
    mechLogin(data: IMechLogin): Promise<MechLoginResponse>;
    getUserByEmail(data: IEmailExitCheck):Promise<EmailExistResponse | null>;
    getAllMechanics(data: IGetAllMechanics): Promise<GetAllMechanicResponse | null>;
    VerifyMechanic (values:IVerifyMechanic):Promise<unknown>
    updateNewPassword(data: IUpdateNewPassword):Promise<UpdateNewPasswordResponse | null>;
    getAllUserRegisteredServices(page: number, limit: number, searchQuery: string,userId:string): Promise<unknown>;
    getComplaintDetails(id:string) :Promise<getComplaintDetailsResponse[] | null >
    getAllAcceptedServices (mechanicId : string) : Promise<getAllAcceptedServiceResponse[]>
    updateWorkDetails(data : IUpdateWorkDetails ) :Promise<unknown>
    getDevcies(): Promise<GetAllDevicesResponse[]>
    getMechanicDetails(data: IGetMechanicDetails): Promise<getMechanicDetailsResponse | null> 
    getS3SingUrlForMechCredinential(data: IGetPreSignedUrl):Promise<GetPreSignedUrlResponse> 
    updateWorkAssigned(complaintId: string,mechanicId: string,status: string,roomId: string): Promise<getUpdatedWorkAssingnedResponse> 
    updateComplaintStatus(complaintId: string, nextStatus: string):Promise<updateCompleteStatusResponse | null>   
    createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> 
    getAllCompletedServices (mechanicId:string):Promise<GetAllMechanicCompletedServicesResponse[] | null>
    editMechanic(mechaicDetails:IUpdatingMechanicDetails) :Promise<IupdateingMechanicDetailsResponse | null> 
    AddMechAddress(data: IAddMechAddress): Promise<IAddMechAddressResponse | null> 
    editAddress(data: IEditAddress): Promise<IEditAddressResponse | null> 
    resendOTP(data: IResendOTPData): Promise<Partial<ITempMech> | null>
    handleRemoveMechAddress(mechId: string,addressId:string): Promise<boolean>
    getMechanicAddress(data: IGetMechanicAddress): Promise<IGetMechanicAddressResponse[] | null>
    setUserDefaultAddress( data: ISetMechDefaultAddress): Promise<SetMechDefaultAddressResponse[] | null> 
}

