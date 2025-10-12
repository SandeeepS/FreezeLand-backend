import { AddUserAddress, AddUserAddressResponse, getAllAddressOfUserResponse, ISetUserDefaultAddress, SetUserDefaultAddressResponse } from "../dataContracts/User/IRepository.dto";

export interface IAddressRepository{
     addAddress(data:AddUserAddress): Promise<AddUserAddressResponse | null>
      getAllAddressOfUser(userId: string): Promise<getAllAddressOfUserResponse[] | null> 
      handleRemoveUserAddress(userId: string,addressId: string): Promise<boolean>
      setDefaultAddress(data: ISetUserDefaultAddress): Promise<SetUserDefaultAddressResponse | null> 
}

export default IAddressRepository;