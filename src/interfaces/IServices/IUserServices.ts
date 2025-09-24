import { IGetMechanicDetails, getMechanicDetailsResponse } from "../dataContracts/Mech/IService.dto";
import {
    ISaveUser,
    SaveUserResponse,
    UserLoginResponse,
    EmailExistCheckResponse,
    GetProfileResponse,
    GetUserByEmail,
    GetServiceResponse,
    AddUserAddressResponse,
    EditUserResponse,
    RegisterServiceResponse,
    UpdateNewPasswordResponse,
    EditAddressResponse,
    SetUserDefaultAddressResponse,
    getUserRegisteredServiceDetailsByIdResponse,
    verifyOTPResponse,
    GetServiceResponse2,
    IPaymentData,
    IupdateUserLocation,
    IupdateUserLocationResponse,
    GenerateRefreshToken,
    IResendOTPData,
    GetPreSignedUrlResponse,
    ISingUp,
    IUserSignUp,
    IGetPreSignedUrl,
    IGetService,
    IUpdateNewPassword,
    IGetServices,
    IRegisterService,
    IGenerateToken,
    ISetUserDefaultAddress,
    IEditAddress,
    IEditUser,
    IGetProfile,
    IUserLogin,
    AddUserAddress,
    getAllAddressOfUserResponse,
  } from "../dataContracts/User/IService.dto";
import { ITempUser } from "../Model/IUser";


export interface IUserServices {
    userRegister(userData: ISingUp):Promise<Partial<ITempUser> | null>   ;
    isUserExist(userData: IUserSignUp): Promise<EmailExistCheckResponse | null>;
    saveUser(userData: ISaveUser): Promise<SaveUserResponse>;
    userLogin(userData: IUserLogin): Promise<UserLoginResponse>;
    getUserByEmail(data: GetUserByEmail): Promise<EmailExistCheckResponse | null>;
    generateToken(data: IGenerateToken, role: string): Promise<string>   
    generateRefreshToken(data: GenerateRefreshToken): Promise<string>   
    hashPassword(password: string): Promise<string>;
    getProfile(data: IGetProfile): Promise<GetProfileResponse>;
    getServices(data: IGetServices): Promise<GetServiceResponse | null>;
    getAllUserRegisteredServices(page: number, limit: number, searchQuery: string,userId:string): Promise<unknown>;
    getUserRegisteredServiceDetailsById (id:string) :Promise<getUserRegisteredServiceDetailsByIdResponse[] >
    updateNewPassword(data:IUpdateNewPassword):Promise<UpdateNewPasswordResponse | null>;
    editUser(data: IEditUser): Promise<EditUserResponse | null> ;
    AddUserAddress(data: AddUserAddress): Promise<AddUserAddressResponse | null>;
    editAddress(data: IEditAddress): Promise<EditAddressResponse | null>;
    setUserDefaultAddress(data: ISetUserDefaultAddress): Promise<SetUserDefaultAddressResponse | null>  ;
    registerService(data: IRegisterService):Promise<RegisterServiceResponse | null>;
    getMechanicDetails(data: IGetMechanicDetails): Promise<getMechanicDetailsResponse | null> 
    getTempUserData(id:string ) : Promise<ITempUser | null> 
    verifyOTP(id: string,otp: string): Promise<verifyOTPResponse>
    getService(data: IGetService): Promise<GetServiceResponse2 | null>
    createStripeSession(data:IPaymentData):Promise<unknown>
    successPayment(data:string):Promise<unknown>
    updateUserLocation(data : IupdateUserLocation):Promise<IupdateUserLocationResponse | null>
    resendOTP(data: IResendOTPData): Promise<Partial<ITempUser> | null> 
    googleLogin(data: { name: string;email: string;googlePhotoUrl: string;}): Promise<UserLoginResponse>
    getPresignedUrl(data: IGetPreSignedUrl):Promise<GetPreSignedUrlResponse> 
    handleRemoveUserAddress(userId: string,addressId:string): Promise<boolean>
    getAllAddressOfUser(userId: string): Promise<getAllAddressOfUserResponse[] | null>

}


