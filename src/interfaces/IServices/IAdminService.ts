
import {
    AddDeviceDTO,
    AddNewDeviceResponse,
    AddNewServiceResponse,
    AddserviceDTO,
    AdminLoginDTO,
    AdminLoginResponse,
    BlockDeviceDTO,
    BlockDeviceResponse,
    BlockMechDTO,
    BlockMechResponse,
    BlockServiceDTO,
    BlockServiceResponse,
    BlockUserDTO,
    BlockUserResponse,
    DeleteDeviceDTO,
    DeleteDeviceResponse,
    DeleteMechDTO,
    DeleteMechResponse,
    DeleteServiceDTO,
    DeleteServiceResponse,
    DeleteUserDTO,
    DeleteUserResponse,
    EditExistServiceDTO,
    EditExistServiceResponse,
    GetDeviceDTO,
    GetDeviceResponse,
    GetMechList,
    GetMechListResponse,
    GetServiceDTO,
    GetServiceResponse,
    GetServiceResponse2,
    GetServicesDTO,
    GetUserList,
    GetUserListResponse,
    isDeviceExistDTO,
    isDeviceExistResponse,
    IsServiceExistDTO,
    IsServiceExistResponse,
    UpdateApproveDTO,
    UpdateApproveResponse,
  } from "../DTOs/Admin/IService.dto";


export interface IAdminService {
        // Authentication methods
        adminLogin(data: AdminLoginDTO): Promise<AdminLoginResponse>;
    
        // User management
        getUserList(data: GetUserList): Promise<GetUserListResponse>;
        blockUser(data: BlockUserDTO):Promise<BlockUserResponse | null>;
        deleteUser(data: DeleteUserDTO):Promise<DeleteUserResponse | null>;
    
        // Mechanic management
        getMechList(data: GetMechList): Promise<GetMechListResponse>;
        blockMech(data: BlockMechDTO):Promise<BlockMechResponse | null> ;
        deleteMech(data: DeleteMechDTO):Promise<DeleteMechResponse| null>;
    
        // Service management
        getServices(data: GetServicesDTO): Promise<GetServiceResponse | null>;
        getService(data: GetServiceDTO):Promise<GetServiceResponse2 | null>;
        addService(data: AddserviceDTO):Promise<AddNewServiceResponse | null> ;
        blockService(data: BlockServiceDTO):Promise<BlockServiceResponse|null>;
        deleteService(data: DeleteServiceDTO):Promise<DeleteServiceResponse |null>;
        editExistingService(data: EditExistServiceDTO):Promise<EditExistServiceResponse|null> ;
        isServiceExist(data: IsServiceExistDTO):Promise<IsServiceExistResponse |null> ;
    
        // Device management
        getDevcies(data: GetDeviceDTO): Promise<GetDeviceResponse>;
        addDevice(data: AddDeviceDTO):Promise<AddNewDeviceResponse|null>;
        blockDevice(data: BlockDeviceDTO):Promise<BlockDeviceResponse | null>;
        deleteDevice(data: DeleteDeviceDTO):Promise<DeleteDeviceResponse|null>;
        isDeviceExist(data: isDeviceExistDTO):Promise<isDeviceExistResponse|null>;
        updateApprove (data:UpdateApproveDTO) : Promise<UpdateApproveResponse  | null>;
}