import mongoose from "mongoose";
import {
  AddUserAddress,
  AddUserAddress2,
  AddUserAddressResponse,
  getAllAddressOfUserResponse,
} from "../interfaces/dataContracts/User/IRepository.dto";
import IAddressRepository from "../interfaces/IRepository/IAddressRepository";
import { IAddress } from "../interfaces/Model/IAddress";
import addressModel from "../models/addressModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class AddressRepository
  extends BaseRepository<IAddress>
  implements IAddressRepository
{
  constructor() {
    super(addressModel);
  }

  async addAddress(
    data: AddUserAddress
  ): Promise<AddUserAddressResponse | null> {
    try {
      const { values } = data;

      if (values._id) {
        const { _id, ...rest } = values;
        console.log(rest);
        const updatedAddress = await this.update(_id, {
          userId: new mongoose.Types.ObjectId(values.userId),
          addressType: values.addressType,
          fullAddress: values.fullAddress,
          houseNumber: values.houseNumber,
          landmark: values.landMark,
          latitude: values.latitude,
          longitude: values.longitude,
        });
        return updatedAddress;
      } else {
        const isAddressCheck = await this.find({
          userId: new mongoose.Types.ObjectId(values.userId),
        });
        console.log("is address is exit for the user ?", isAddressCheck);
        if (isAddressCheck?.length === 0) {
          const addressToSave: AddUserAddress2 = {
            ...values,
            userId: new mongoose.Types.ObjectId(values.userId),
          };
          const addedAddress = await this.save(addressToSave);
          return addedAddress;
        } else {
          const addressToSave: AddUserAddress2 = {
            ...values,
            userId: new mongoose.Types.ObjectId(values.userId),
            isDefaultAddress: false,
          };
          const addedAddress = await this.save(addressToSave);
          return addedAddress;
        }
      }
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getAllAddressOfUser(
    userId: string
  ): Promise<getAllAddressOfUserResponse[] | null> {
    try {
      const newObjId = new mongoose.Types.ObjectId(userId);
      const qr = { userId: newObjId, isDeleted: false };
      const allAddress = await this.find(qr);
      return allAddress;
    } catch (error) {
      console.log(
        "error occured while getting the user address from the address repository ",
        error
      );
      throw error;
    }
  }

  async handleRemoveUserAddress(
    userId: string,
    addressId: string
  ): Promise<boolean> {
    try {
      const result = await addressModel.findByIdAndUpdate(
        { _id: addressId, userId: userId },
        { $set: { isDeleted: true } }
      );

      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error occurred while removing user address in userRepository"
      );
    }
  }
}

export default AddressRepository;
