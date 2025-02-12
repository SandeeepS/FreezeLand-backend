import {
    AddUserAddressDTO,
    AddUserAddressResponse,
    GetAllServicesDTO,
    GetAllServiceResponse,
    EditAddressDTO,
    EditUserDTO,
    EditUserResponse,
    EmailExistCheckDTO,
    EmailExistCheckResponse,
    RegisterServiceDTO,
    SetUserDefaultAddressDTO,
    GetServiceCountDTO,
    SaveUserResponse,
    SaveUserDTO,
    FindEmailResponse,
    FindEmailDTO,
    GetUserByIdDTO,
    GetUserByIdResponse,
    UpdateNewPasswordResponse,
    UpdateNewPasswordDTO,
    GetUserListDTO,
    GetUserListResponse,
    GetAllUserRegisteredServicesDTO,
    GetAllUserRegisteredServicesResponse,
    EditAddressResponse,
    SetUserDefaultAddressResponse,
    RegisterServiceResponse
  } from "../DTOs/User/IRepository.dto";


export interface IUserRepository {
    saveUser( userData: SaveUserDTO): Promise<SaveUserResponse | null>;
    findEmail(data:FindEmailDTO): Promise<FindEmailResponse | null>;
    emailExistCheck(data: EmailExistCheckDTO): Promise<EmailExistCheckResponse | null>;
    updateNewPassword(data:UpdateNewPasswordDTO): Promise<UpdateNewPasswordResponse | null>;
    getUserById(data:GetUserByIdDTO): Promise<GetUserByIdResponse | null>;
    getUserList(data:GetUserListDTO): Promise<GetUserListResponse[]> ;
    getUserCount(regex: RegExp): Promise<number>;
    getAllServices(data: GetAllServicesDTO): Promise<GetAllServiceResponse[] | null>;
    getServiceCount(data: GetServiceCountDTO): Promise<number>;
    getAllUserRegisteredServices(data: GetAllUserRegisteredServicesDTO): Promise<GetAllUserRegisteredServicesResponse[] | null>;
    editUser(data: EditUserDTO): Promise<EditUserResponse | null>;
    addAddress(data: AddUserAddressDTO): Promise<AddUserAddressResponse | null>;
    editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null>;
    setDefaultAddress(data: SetUserDefaultAddressDTO): Promise<SetUserDefaultAddressResponse| null> ;
    registerService(data: RegisterServiceDTO):Promise<RegisterServiceResponse | null> ;
}