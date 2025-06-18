
import {
     IAddDevice,
    AddNewDeviceResponse,
    AddNewServiceResponse,
    IAddService,
    IAdminLogin,
    AdminLoginResponse,
    BlockDeviceDTO,
    BlockDeviceResponse,
    IBlockMech,
    BlockMechResponse,
    IBlockService,
    BlockServiceResponse,
    IBlockUser,
    BlockUserResponse,
     IDeleteDevice,
    DeleteDeviceResponse,
    IDeleteMech,
    DeleteMechResponse,
    DeleteServiceDTO,
    DeleteServiceResponse,
    IDeleteUser,
    DeleteUserResponse,
    EditExistServiceDTO,
    EditExistServiceResponse,
    IGetDevice,
    GetDeviceResponse,
    GetMechList,
    GetMechListResponse,
    IGetService,
    GetServiceResponse,
    GetServiceResponse2,
    IGetServices,
    GetUserList,
    GetUserListResponse,
    IisDeviceExist,
    isDeviceExistResponse,
    IsServiceExistResponse,
    IUpdateApprove,
    UpdateApproveResponse,
  } from "../DTOs/Admin/IService.dto";


export interface IAdminService {
        // Authentication methods
        adminLogin(data: IAdminLogin): Promise<AdminLoginResponse>;
    
        // User management
        getUserList(data: GetUserList): Promise<GetUserListResponse>;
        blockUser(data: IBlockUser):Promise<BlockUserResponse | null>;
        deleteUser(data: IDeleteUser):Promise<DeleteUserResponse | null>;
    
        // Mechanic management
        getMechList(data: GetMechList): Promise<GetMechListResponse>;
        blockMech(data: IBlockMech):Promise<BlockMechResponse | null> ;
        deleteMech(data: IDeleteMech):Promise<DeleteMechResponse| null>;
    
        // Service management
        getServices(data: IGetServices): Promise<GetServiceResponse | null>;
        getService(data: IGetService):Promise<GetServiceResponse2 | null>;
        addService(data: IAddService):Promise<AddNewServiceResponse | null> ;
        blockService(data: IBlockService):Promise<BlockServiceResponse|null>;
        deleteService(data: DeleteServiceDTO):Promise<DeleteServiceResponse |null>;
        editExistingService(data: EditExistServiceDTO):Promise<EditExistServiceResponse|null> ;
        isServiceExist(name:string):Promise<IsServiceExistResponse |null> ;
    
        // Device management
        getDevcies(data: IGetDevice): Promise<GetDeviceResponse>;
        addDevice(data:  IAddDevice):Promise<AddNewDeviceResponse|null>;
        blockDevice(data: BlockDeviceDTO):Promise<BlockDeviceResponse | null>;
        deleteDevice(data:  IDeleteDevice):Promise<DeleteDeviceResponse|null>;
        isDeviceExist(data: IisDeviceExist):Promise<isDeviceExistResponse|null>;
        updateApprove (data:IUpdateApprove) : Promise<UpdateApproveResponse  | null>;
}