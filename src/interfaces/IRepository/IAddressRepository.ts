import { AddUserAddress, AddUserAddressResponse, getAllAddressOfUserResponse } from "../dataContracts/User/IRepository.dto";

export interface IAddressRepository{
     addAddress(data:AddUserAddress): Promise<AddUserAddressResponse | null>
      getAllAddressOfUser(userId: string): Promise<getAllAddressOfUserResponse[] | null> 
}

export default IAddressRepository;