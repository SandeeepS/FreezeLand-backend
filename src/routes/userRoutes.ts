import  express,{Router,Request,Response,NextFunction}  from "express";
import userController from "../controllers/userController";
import UserRepository from "../repositories/userRepository";
import userService from "../services/userService";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import userAuth from "../middlewares/userAuthMidd";

const userRouter:Router = express.Router();
const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const userRepository = new UserRepository();
const userServices = new userService(userRepository,createjwt,encrypt);
const controller = new userController(userServices);

userRouter.post('/registration',async(req:Request,res:Response,next:NextFunction) => await controller.userSignup(req,res,next));
userRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await controller.userLogin(req,res,next))
userRouter.post('/google-login', async (req: Request, res: Response, next: NextFunction) => await controller.googleLogin(req, res, next));
userRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => await controller.logout(req, res,next));
userRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.veryfyOtp(req,res,next));
userRouter.post('/forgot-password', async (req: Request, res: Response,next:NextFunction) => await controller.forgotResentOtp(req, res,next));
userRouter.post('/verify-forgot-otp', async (req: Request, res: Response,next:NextFunction) => await controller.VerifyForgotOtp(req, res,next));
userRouter.put('/update-newpassword',userAuth(["user"]),async(req: Request, res: Response,next:NextFunction) => await controller.updateNewPassword(req, res,next));
userRouter.get('/profile',userAuth(["user"]),async (req: Request, res: Response,next:NextFunction) => await controller.getProfile(req, res,next));
userRouter.put('/editUser',userAuth(["user"]),async (req:Request,res:Response,next:NextFunction) => await controller.editUser(req,res,next));
userRouter.post('/addAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.addAddress(req,res,next));
userRouter.put('/setDefaultAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.setDefaultAddress(req,res,next));
userRouter.put('/editAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.editAddress(req,res,next));
userRouter.post('/registerService',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.registerService(req,res,next));
userRouter.get('/getAllServices',async(req:Request,res:Response,next:NextFunction) =>await controller.getAllServices(req,res,next));//getting all service which is provided by the website
userRouter.get('/getAllRegisteredService',userAuth(["user"]),  async(req:Request,res:Response,next:NextFunction) => await controller.getAllRegisteredService(req,res,next)); //getting all compliantes registrerd by user 
userRouter.get('/getImageUrl', async(req:Request,res:Response,next:NextFunction) => await controller.getImageUrl(req,res,next));

export default userRouter;