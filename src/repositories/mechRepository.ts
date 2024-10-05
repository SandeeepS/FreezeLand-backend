import MechModel, { MechInterface } from "../models/mechModel";
import { comRepository } from "./comRepository";

class MechRepository implements comRepository<MechInterface> {
  async saveMechanic(
    mechData: Partial<MechInterface>
  ): Promise<MechInterface | null> {
    try {
      const newMech = new MechModel(mechData);
      await newMech.save();
      return newMech as MechInterface;
    } catch (error) {
      console.log("Error from mechRepsitory", error as Error);
      throw error;
    }
  }

  async emailExistCheck(email: string): Promise<MechInterface | null> {
    try {
      const mechFound = await MechModel.findOne({ email: email });
      console.log("mechFound in the mech repository", mechFound);
      return mechFound as MechInterface;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async updateNewPassword(password: string, userId: string) {
    try {
      const user = await MechModel.findById(userId);
      if (user) user.password = password;
      const updatedUser = await user?.save();
      return updatedUser;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }
}
export default MechRepository;
