import MechModel,{MechInterface} from "../models/mechModel";

class MechRepository{
    async saveMechanic(mechData:MechInterface):Promise<MechInterface | null>{
        try{
            const newMech = new MechModel(mechData);
            await newMech.save();
            return newMech as MechInterface;

        }catch(error){
            console.log("Error from mechRepsitory",error as Error);
            return null;
        }
    }

    async emailExistCheck(email: string): Promise<MechInterface | null> {
        try {
          const userFound = await MechModel.findOne({ email: email });
          return userFound as MechInterface;
        } catch (error) {
          console.log(error as Error);
          return null;
        }
      }
}


export default MechRepository;