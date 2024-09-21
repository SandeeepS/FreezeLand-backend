import  express,{Router,Request,Response,NextFunction}  from "express";
import userController from "../controllers/userController";
import UserRepository from "../repositories/userRepository";
import userService from "../services/userService";

const userRouter:Router = express.Router();
const userRepository = new UserRepository()
const userServices = new userService(userRepository);
const controller = new userController(userServices);

userRouter.post('/user/registration',async(req:Request,res:Response) => await controller.userSignup(req,res));

export default userRouter;