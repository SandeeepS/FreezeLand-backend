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


userRouter.post('/user/registration',async(req:Request,res:Response,next:NextFunction) => await controller.userSignup(req,res,next));
userRouter.post('/user/login',async(req:Request,res:Response,next:NextFunction) => await controller.userLogin(req,res,next) )
userRouter.post('/user/google-login', async (req: Request, res: Response, next: NextFunction) => await controller.googleLogin(req, res, next));

userRouter.get('/user/logout', async (req: Request, res: Response,next:NextFunction) => await controller.logout(req, res,next));
userRouter.post('/user/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.veryfyOtp(req,res,next));
userRouter.post('/user/forgot-password', async (req: Request, res: Response,next:NextFunction) => await controller.forgotResentOtp(req, res,next));
userRouter.post('/user/verify-forgot-otp', async (req: Request, res: Response,next:NextFunction) => await controller.VerifyForgotOtp(req, res,next));
userRouter.put('/user/update-newpassword', async (req: Request, res: Response,next:NextFunction) => await controller.updateNewPassword(req, res,next));
userRouter.get('/user/profile', authenticate, async (req: Request, res: Response,next:NextFunction) => await controller.getProfile(req, res,next));
userRouter.put('/user/editUser',async (req:Request,res:Response,next:NextFunction) => await controller.editUser(req,res,next));
userRouter.post('/user/addAddress',async(req:Request,res:Response,next:NextFunction) => await controller.addAddress(req,res,next));
userRouter.put('/user/setDefaultAddress',async(req:Request,res:Response,next:NextFunction) => await controller.setDefaultAddress(req,res,next));
userRouter.put('/user/editAddress', async(req:Request,res:Response,next:NextFunction) => await controller.editAddress(req,res,next));
userRouter.post('/user/registerService',async(req:Request,res:Response,next:NextFunction) => await controller.registerService(req,res,next));
userRouter.get('/user/getAllRegisteredService',async(req:Request,res:Response,next:NextFunction) => await controller.getAllRegisteredService(req,res,next));


export default userRouter;