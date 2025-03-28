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
    SetUserDefaultAddressResponse
  } from "../DTOs/User/IService.dto";


export interface IUserServices {
    isUserExist(userData: UserSignUpDTO): Promise<EmailExistCheckResponse | null>;
    saveUser(userData: SaveUserDTO): Promise<SaveUserResponse>;
    userLogin(userData: UserLoginDTO): Promise<UserLoginResponse>;
    getUserByEmail(data: GetUserByEmail): Promise<EmailExistCheckResponse | null>;
    generateToken(data: GenerateTokenDTO, role: string): string | undefined;
    generateRefreshToken(data: GenerateTokenDTO): string | undefined;
    hashPassword(password: string): Promise<string>;
    getProfile(data: GetProfileDTO): Promise<GetProfileResponse>;
    getServices(data: GetServicesDTO): Promise<GetServiceResponse | null>;
    getAllRegisteredServices(page: number, limit: number, searchQuery: string): Promise<unknown>;
    updateNewPassword(data:UpdateNewPasswordDTO):Promise<UpdateNewPasswordResponse | null>;
    editUser(data: EditUserDTO): Promise<EditUserResponse | null> ;
    AddUserAddress(data: AddUserAddressDTO): Promise<AddUserAddressResponse | null>;
    editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null>;
    setUserDefaultAddress(data: SetUserDefaultAddressDTO): Promise<SetUserDefaultAddressResponse | null>  ;
    registerService(data: RegisterServiceDTO):Promise<RegisterServiceResponse | null>;
}

