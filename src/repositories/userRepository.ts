import mongoose from "mongoose";
import userModel, { UserInterface } from "../models/userModel";

class UserRepository{
    async saveUser(userData:UserInterface):Promise<UserInterface| null> {
        try{
             const newUser = new userModel(userData);
             await newUser.save();
             return newUser as UserInterface
        }catch(error){

            console.log("Error from userRepository",error as Error);
            return null;
        }
    }
}

export default UserRepository

