import mongoose from "mongoose";
import { AddUserAddress, AddUserAddressResponse } from "../interfaces/dataContracts/User/IRepository.dto";
import IAddressRepository from "../interfaces/IRepository/IAddressRepository";
import { IAddress } from "../interfaces/Model/IAddress";
import addressModel from "../models/addressModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class AddressRepository
  extends BaseRepository<IAddress>
  implements IAddressRepository {

    constructor(){
        super(addressModel);
    }


     async addAddress(
        data:AddUserAddress
      ): Promise<AddUserAddressResponse | null> {
        try {
          console.log(data)
          const { values } = data;
          console.log("id from the userRepository while add addresss is ",values);
          console.log("new address from the userRepository is ", values);
      
          // Convert userId from string to ObjectId
          const addressToSave = {
            ...values,
            userId: new mongoose.Types.ObjectId(values.userId)
          };
          const addedAddress = await this.save(addressToSave);
          return addedAddress;
        } catch (error) {
          console.log(error as Error);
          throw error;
        }
      }
    


}

export default AddressRepository;
