import { getMechanicDetailsDTO, getMechanicDetailsResponse } from "../DTOs/Mech/IService.dto";
import {
    UserSignUpDTO,
    SaveUserDTO,
    UserLoginDTO,
    SaveUserResponse,
    UserLoginResponse,
    EmailExistCheckResponse,
    GetProfileDTO,
    GetProfileResponse,
    EditUserDTO,
    AddUserAddressDTO,
    EditAddressDTO,
    SetUserDefaultAddressDTO,
    GetUserByEmail,
    GenerateTokenDTO,
    RegisterServiceDTO,
    GetServicesDTO,
    GetServiceResponse,
    AddUserAddressResponse,
    EditUserResponse,
    RegisterServiceResponse,
    UpdateNewPasswordDTO,
    UpdateNewPasswordResponse,
    EditAddressResponse,
    SetUserDefaultAddressResponse,
    getUserRegisteredServiceDetailsByIdResponse,
    SingUpDTO,
    verifyOTPResponse,
    GetServiceDTO,
    GetServiceResponse2,
  } from "../DTOs/User/IService.dto";
import { ITempUser } from "../Model/IUser";


export interface IUserServices {
    userRegister(userData: SingUpDTO):Promise<Partial<ITempUser> | null>   ;
    isUserExist(userData: UserSignUpDTO): Promise<EmailExistCheckResponse | null>;
    saveUser(userData: SaveUserDTO): Promise<SaveUserResponse>;
    userLogin(userData: UserLoginDTO): Promise<UserLoginResponse>;
    getUserByEmail(data: GetUserByEmail): Promise<EmailExistCheckResponse | null>;
    generateToken(data: GenerateTokenDTO, role: string): string | undefined;
    generateRefreshToken(data: GenerateTokenDTO): string | undefined;
    hashPassword(password: string): Promise<string>;
    getProfile(data: GetProfileDTO): Promise<GetProfileResponse>;
    getServices(data: GetServicesDTO): Promise<GetServiceResponse | null>;
    getAllUserRegisteredServices(page: number, limit: number, searchQuery: string,userId:string): Promise<unknown>;
    getUserRegisteredServiceDetailsById (id:string) :Promise<getUserRegisteredServiceDetailsByIdResponse[] >
    updateNewPassword(data:UpdateNewPasswordDTO):Promise<UpdateNewPasswordResponse | null>;
    editUser(data: EditUserDTO): Promise<EditUserResponse | null> ;
    AddUserAddress(data: AddUserAddressDTO): Promise<AddUserAddressResponse | null>;
    editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null>;
    setUserDefaultAddress(data: SetUserDefaultAddressDTO): Promise<SetUserDefaultAddressResponse | null>  ;
    registerService(data: RegisterServiceDTO):Promise<RegisterServiceResponse | null>;
    getMechanicDetails(data: getMechanicDetailsDTO): Promise<getMechanicDetailsResponse | null> 
    getTempUserData(id:string ) : Promise<ITempUser | null> 
    verifyOTP(id: string,otp: string): Promise<verifyOTPResponse>
    getService(data: GetServiceDTO): Promise<GetServiceResponse2 | null>
}

