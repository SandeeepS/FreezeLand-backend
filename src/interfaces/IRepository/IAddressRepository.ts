import { AddUserAddress, AddUserAddressResponse } from "../dataContracts/User/IRepository.dto";

export interface IAddressRepository{
     addAddress(data:AddUserAddress): Promise<AddUserAddressResponse | null>
}

export default IAddressRepository;