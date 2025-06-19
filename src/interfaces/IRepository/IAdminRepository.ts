
import {
    AddNewDeviceResponse,
    IAddNewService,
    AddNewServiceResponse,
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
    DeleteServiceResponse,
    IDeleteUser,
    DeleteUserResponse,
    EditExistServiceResponse,
    IIsAdminExist,
    IsAdminExistResponse,
    IisDeviceExist,
    isDeviceExistResponse,
    IsServiceExistResponse,
    IUpdateApprove,
    UpdateApproveResponse,
    IAddNewDevice,
    IBlockDevice,
    IDeleteService,
    IEditExistService,
    IsServiceExist,
  } from "../dataContracts/Admin/IRepository.dto";

export interface IAdminRepository{
    

    blockUser(data: IBlockUser): Promise<BlockUserResponse | null>;
    blockMech(data: IBlockMech): Promise<BlockMechResponse | null>;
    BlockService(data: IBlockService): Promise<BlockServiceResponse | null>;
    BlockDevice(data: IBlockDevice): Promise<BlockDeviceResponse | null>;

    deleteUser(data: IDeleteUser): Promise<DeleteUserResponse | null>;
    deleteMech(data: IDeleteMech): Promise<DeleteMechResponse | null>;
    deleteService(data: IDeleteService): Promise<DeleteServiceResponse | null>;
    deleteDevice(data:  IDeleteDevice): Promise<DeleteDeviceResponse | null>;

    isServiceExist(data: IsServiceExist): Promise<IsServiceExistResponse | null>;
    isDeviceExist(data: IisDeviceExist): Promise<isDeviceExistResponse | null>;
    isAdminExist(data: IIsAdminExist): Promise<IsAdminExistResponse | null>

    addNewServices(data: IAddNewService): Promise<AddNewServiceResponse | null>;
    addNewDevice(data: IAddNewDevice): Promise<AddNewDeviceResponse | null>;
    editExistService(data: IEditExistService): Promise<EditExistServiceResponse | null>
    updateApprove (data:IUpdateApprove) : Promise<UpdateApproveResponse | null> 
}