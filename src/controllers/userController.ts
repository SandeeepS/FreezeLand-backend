import { Request,Response } from "express";
import userService from "../services/userService";

class userController{
    constructor(private userServices:userService){}

    async userSignup(req:Request,res:Response):Promise<void>{
        try{
            req.app.locals.userData = req.body;
            const newUser = await this.userServices.signupUser(req.app.locals.userData);
            console.log("enterd into the backend");
            console.log(newUser);
        }catch(error){
            console.log(error as Error);

        }
    }

}

export default userController