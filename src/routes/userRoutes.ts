import  express,{Router,Request,Response,NextFunction}  from "express";
import userController from "../controllers/userController";
import UserRepository from "../repositories/userRepository";
import userService from "../services/userService";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import authenticate from '../middlewares/userAuthMidd'


const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const userRouter:Router = express.Router();
const userRepository = new UserRepository()
const userServices = new userService(userRepository,createjwt,encrypt);
const controller = new userController(userServices);


userRouter.post('/user/registration',async(req:Request,res:Response) => await controller.userSignup(req,res));
userRouter.post('/user/login',async(req:Request,res:Response) => await controller.userLogin(req,res) )
userRouter.get('/user/logout', async (req: Request, res: Response) => await controller.logout(req, res));
userRouter.post('/user/veryfy-otp',async(req:Request,res:Response) => await controller.veryfyOtp(req,res));
userRouter.post('/user/forgot-password', async (req: Request, res: Response) => await controller.forgotResentOtp(req, res));
userRouter.post('/user/verify-forgot-otp', async (req: Request, res: Response) => await controller.VerifyForgotOtp(req, res));
userRouter.put('/user/update-newpassword', async (req: Request, res: Response) => await controller.updateNewPassword(req, res));



userRouter.get('/profile', authenticate, async (req: Request, res: Response) => await controller.getProfile(req, res));


export default userRouter;