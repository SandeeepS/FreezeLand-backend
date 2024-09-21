import { Request,Response } from "express";
import userService from "../services/userService";

class userController{
    constructor(private userServices:userService){}

    async userSignup(req:Request,res:Response):Promise<void>{
        try{
            console.log("req body is ",req.body)
            req.app.locals.userData = req.body;
            console.log("User detials from userController is ", req.app.locals.userData)
            const newUser = await this.userServices.signupUser(req.app.locals.userData);
            console.log("enterd into the backend");
            console.log(newUser);
        }catch(error){
            console.log(error as Error);
        }
    }

    async userLogin(req:Request,res:Response) : Promise<void>{
        try{
            const {email,password} : {email:string,password:string} = req.body;
            console.log("email and password from the backend is ",email,password);
            const loginStatus = await this.userServices.userLogin(email,password);
            console.log("login status from the userController is ",loginStatus);
            if(loginStatus) {
                res.status(200).json({
                    success:true,
                    message:"Login successfull . Redirecting to home page ",
                });
            }else{
                res.status(401).json({
                    success:false,
                    message:"Invalid email or password"
                });
            }
        }catch(error){
            console.log("error occured in the backend while login user",error as Error)
            res.status(500).json({
                success: false,
                message: "An error occurred during login. Please try again later.",
            });
        }
    }

}

export default userController