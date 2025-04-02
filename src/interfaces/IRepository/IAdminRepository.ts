
import {
    AddNewDeviceDTO,
    AddNewDeviceResponse,
    AddNewServiceDTO,
    AddNewServiceResponse,
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
    GetAllDevicesDTO,
    GetAllDevicesResponse,
    GetAllServiceResponse,
    GetAllServicesDTO,
    GetDeviceCountDTO,
    GetMechCountDTO,
    GetMechListDTO,
    GetMechListResponse,
    GetServiceCountDTO,
    GetServiceDTO,
    GetServiceResponse,
    GetUserCountDTO,
    GetUserListDTO,
    GetUserListResponse,
    IsAdminExistDTO,
    IsAdminExistResponse,
    IsDeviceExistDTO,
    isDeviceExistResponse,
    IsServiceExistDTO,
    IsServiceExistResponse,
  } from "../DTOs/Admin/IRepository.dto";

export interface IAdminRepository{
    getUserList(data: GetUserListDTO): Promise<GetUserListResponse[] | null>;
    getMechList(data: GetMechListDTO): Promise<GetMechListResponse[]>;
    getAllServices(data: GetAllServicesDTO): Promise<GetAllServiceResponse[] | null>;
    getAllDevices(data: GetAllDevicesDTO): Promise<GetAllDevicesResponse[] | null>;
    
    getUserCount(data: GetUserCountDTO): Promise<number>;
    getServiceCount(data: GetServiceCountDTO): Promise<number>;
    getMechCount(data: GetMechCountDTO): Promise<number>;
    getDeviceCount(data: GetDeviceCountDTO): Promise<number>;

    blockUser(data: BlockUserDTO): Promise<BlockUserResponse | null>;
    blockMech(data: BlockMechDTO): Promise<BlockMechResponse | null>;
    BlockService(data: BlockServiceDTO): Promise<BlockServiceResponse | null>;
    BlockDevice(data: BlockDeviceDTO): Promise<BlockDeviceResponse | null>;

    deleteUser(data: DeleteUserDTO): Promise<DeleteUserResponse | null>;
    deleteMech(data: DeleteMechDTO): Promise<DeleteMechResponse | null>;
    deleteService(data: DeleteServiceDTO): Promise<DeleteServiceResponse | null>;
    deleteDevice(data: DeleteDeviceDTO): Promise<DeleteDeviceResponse | null>;

    isServiceExist(data: IsServiceExistDTO): Promise<IsServiceExistResponse | null>;
    isDeviceExist(data: IsDeviceExistDTO): Promise<isDeviceExistResponse | null>;
    isAdminExist(data: IsAdminExistDTO): Promise<IsAdminExistResponse | null>

    addNewServices(data: AddNewServiceDTO): Promise<AddNewServiceResponse | null>;
    addNewDevice(data: AddNewDeviceDTO): Promise<AddNewDeviceResponse | null>;
    getService(data: GetServiceDTO): Promise<GetServiceResponse | null>

    editExistService(data: EditExistServiceDTO): Promise<EditExistServiceResponse | null>
}