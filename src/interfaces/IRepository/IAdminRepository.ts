
import {
    AddNewDeviceDTO,
    AddNewDeviceResponse,
    IAddNewService,
    AddNewServiceResponse,
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
    IIsAdminExist,
    IsAdminExistResponse,
    IisDeviceExist,
    isDeviceExistResponse,
    IsServiceExistDTO,
    IsServiceExistResponse,
    IUpdateApprove,
    UpdateApproveResponse,
  } from "../DTOs/Admin/IRepository.dto";

export interface IAdminRepository{
    

    blockUser(data: IBlockUser): Promise<BlockUserResponse | null>;
    blockMech(data: IBlockMech): Promise<BlockMechResponse | null>;
    BlockService(data: IBlockService): Promise<BlockServiceResponse | null>;
    BlockDevice(data: BlockDeviceDTO): Promise<BlockDeviceResponse | null>;

    deleteUser(data: IDeleteUser): Promise<DeleteUserResponse | null>;
    deleteMech(data: IDeleteMech): Promise<DeleteMechResponse | null>;
    deleteService(data: DeleteServiceDTO): Promise<DeleteServiceResponse | null>;
    deleteDevice(data:  IDeleteDevice): Promise<DeleteDeviceResponse | null>;

    isServiceExist(data: IsServiceExistDTO): Promise<IsServiceExistResponse | null>;
    isDeviceExist(data: IisDeviceExist): Promise<isDeviceExistResponse | null>;
    isAdminExist(data: IIsAdminExist): Promise<IsAdminExistResponse | null>

    addNewServices(data: IAddNewService): Promise<AddNewServiceResponse | null>;
    addNewDevice(data: AddNewDeviceDTO): Promise<AddNewDeviceResponse | null>;
    editExistService(data: EditExistServiceDTO): Promise<EditExistServiceResponse | null>
    updateApprove (data:IUpdateApprove) : Promise<UpdateApproveResponse | null> 
}