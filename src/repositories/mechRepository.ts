import {
  EmailExistResponse,
  EmailExitCheck,
  SaveMechDTO,
  SaveMechResponse,
  UpdateNewPasswordDTO,
  UpdateNewPasswordResponse,
} from "../interfaces/DTOs/Mech/IRepository.dto";
import MechModel, { MechInterface } from "../models/mechModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { Document } from "mongoose";

class MechRepository extends BaseRepository<MechInterface & Document>{
  constructor() {
    super(MechModel);
  }

  async saveMechanic(mechData: SaveMechDTO): Promise<SaveMechResponse | null> {
    return this.save(mechData);
  }

  async emailExistCheck(
    data: EmailExitCheck
  ): Promise<EmailExistResponse | null> {
    try {
      const { email } = data;
      const mechFound = await this.findOne({ email });
      console.log("Mechanic found in the MechRepository:", mechFound);
      return mechFound;
    } catch (error) {
      console.log(
        "Error in MechRepository while checking email existence",
        error as Error
      );
      throw error;
    }
  }

  async updateNewPassword(
    data: UpdateNewPasswordDTO
  ): Promise<UpdateNewPasswordResponse | null> {
    try {
      const { mechId, password } = data;
      const mech = await this.findById(mechId);
      if (mech) {
        mech.password = password;
        return await mech.save();
      }
      return null;
    } catch (error) {
      console.log(
        "Error in MechRepository while updating password",
        error as Error
      );
      throw error;
    }
  }

  async getMechById(id: string): Promise<MechInterface | null> {
    return this.findById(id);
  }

  async getMechList(
    page: number,
    limit: number,
    searchQuery: RegExp
  ): Promise<MechInterface[]> {
    try {
      const regex = new RegExp(searchQuery, "i");
      const result = await this.findAll(page, limit, regex);
      console.log("mech list is ", result);
      return result as MechInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //getting the mechCount
  async getMechCount(regex: RegExp): Promise<number> {
    try {
      const result = await this.countDocument(regex);
      return result as number;
    } catch (error){
      console.log(
        "error occured while getting the count in the userRepository",
        error
      );
      throw new Error();
    }
  }

  async AddService(values: string) {
    try {
      const result = await this.addService(values);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }
}

export default MechRepository;
