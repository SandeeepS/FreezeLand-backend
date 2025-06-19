import { IGetMechanicDetails, getMechanicDetailsResponse } from "../dataContracts/Mech/IRepository.dto";
import {
    IAddUserAddress,
    AddUserAddressResponse,
    IGetAllServices,
    GetAllServiceResponse,
    IEditAddress,
    IEditUser,
    EditUserResponse,
    EmailExistCheckResponse,
    IRegisterService,
    SaveUserResponse,
    ISaveUser,
    FindEmailResponse,
    IFindEmail,
    IGetUserById,
    GetUserByIdResponse,
    UpdateNewPasswordResponse,
    IUpdateNewPassword,
    IGetUserList,
    GetUserListResponse,
    IGetAllUserRegisteredServices,
    GetAllUserRegisteredServicesResponse,
    EditAddressResponse,
    SetUserDefaultAddressResponse,
    RegisterServiceResponse,
    getUserRegisteredServiceDetailsByIdResponse,
    IupdateUserLocation,
    IupdateUserLocationResponse,
    IUpdateTempDataWithOTP,
    IEmailExistCheck,
    ISetUserDefaultAddress,
    IGetServiceCount,
    
  } from "../dataContracts/User/IRepository.dto";
import { ITempUser } from "../Model/IUser";


export interface IUserRepository {
    saveUser( userData: ISaveUser): Promise<SaveUserResponse | null>;
    findEmail(data:IFindEmail): Promise<FindEmailResponse | null>;
    emailExistCheck(data: IEmailExistCheck): Promise<EmailExistCheckResponse | null>;
    updateNewPassword(data:IUpdateNewPassword): Promise<UpdateNewPasswordResponse | null>;
    getUserById(data:IGetUserById): Promise<GetUserByIdResponse | null>;
    getUserList(data:IGetUserList): Promise<GetUserListResponse[]> ;
    getUserCount(regex: RegExp): Promise<number>;
    getAllServices(data: IGetAllServices): Promise<GetAllServiceResponse[] | null>;
    getServiceCount(data: IGetServiceCount): Promise<number>;
    getAllUserRegisteredServices(data: IGetAllUserRegisteredServices): Promise<GetAllUserRegisteredServicesResponse[] | null>;
    getUserRegisteredServiceDetailsById (id:string) :Promise<getUserRegisteredServiceDetailsByIdResponse[]>
    editUser(data: IEditUser): Promise<EditUserResponse | null>;
    addAddress(data: IAddUserAddress): Promise<AddUserAddressResponse | null>;
    editAddress(data: IEditAddress): Promise<EditAddressResponse | null>;
    setDefaultAddress(data: ISetUserDefaultAddress): Promise<SetUserDefaultAddressResponse| null> ;
    registerService(data: IRegisterService):Promise<RegisterServiceResponse | null> ;
    getMechanicDetails(data: IGetMechanicDetails): Promise<getMechanicDetailsResponse | null>
    createTempUserData(data: Partial<ITempUser>): Promise<Partial<ITempUser | null>>
    getTempUserData(id:string):Promise<ITempUser | null>
    updateUserLocation(data:IupdateUserLocation):Promise<IupdateUserLocationResponse | null>
    updateTempUserData(data: IUpdateTempDataWithOTP): Promise<ITempUser | null> 
    handleRemoveUserAddress(userId: string, addressId: string): Promise<boolean>
}