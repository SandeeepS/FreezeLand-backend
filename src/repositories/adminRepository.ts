import { AdminInterface } from "../models/adminModel";
import AdminModel from "../models/adminModel";
import { UserInterface } from "../models/userModel";
import userModel from "../models/userModel";


class AdminRepository{
    async getAdminById(id: string): Promise<AdminInterface | null> {
        try {
            const admin = await AdminModel.findById(id);
            return admin;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    async isAdminExist(email: string): Promise<AdminInterface| null> {
        console.log("enterd in the isAdminExist",email);
        const admin = await AdminModel.findOne({ email: email });
        if (admin){
            console.log("admin is exist",admin)
            return admin as AdminInterface
        } 
        else{
            console.log("admin is not exists");
            return null;
        } 
    }
}

export default AdminRepository;