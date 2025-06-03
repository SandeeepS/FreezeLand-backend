import  express,{Router,Request,Response,NextFunction}  from "express";
import userController from "../controllers/userController";
import UserRepository from "../repositories/userRepository";
import userService from "../services/userService";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import userAuth from "../middlewares/userAuthMidd";
import { GenerateOTP } from "../utils/generateOtp";
import { Email } from "../utils/email";
import ServiceRepository from "../repositories/serviceRepository";
import OrderServices from "../services/orderServices";
import OrderRepository from "../repositories/orderRepository";
import ConcernRepository from "../repositories/concernRepository";
import MechRepository from "../repositories/mechRepository";
import ReportRepository from "../repositories/reportRepository";
import ReportService from "../services/reportService";

const userRouter:Router = express.Router();
const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const userRepository = new UserRepository();
const serviceRepository = new ServiceRepository();
const orderRepository = new OrderRepository();
const concernRepository = new ConcernRepository();
const mechRepository = new MechRepository()
const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const orderService = new OrderServices(orderRepository,mechRepository);
const generateOTP  = new GenerateOTP();

const email = new Email(generateOTP);
const userServices = new userService(userRepository,serviceRepository,concernRepository,orderRepository,orderService,createjwt,encrypt,email);
const controller = new userController(userServices,reportService,encrypt,createjwt,email);

userRouter.post('/registration',async(req:Request,res:Response,next:NextFunction) => await controller.userSignup(req,res,next));
userRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await controller.userLogin(req,res,next))
userRouter.post('/google-login', async (req: Request, res: Response, next: NextFunction) => await controller.googleLogin(req, res, next));
userRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => await controller.logout(req, res,next));
userRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.verifyOtp(req,res,next));
userRouter.get('/getTempUserData',async(req:Request,res:Response,next:NextFunction) => await controller.getTempUserData(req,res,next));
userRouter.post('/forgot-password', async (req: Request, res: Response,next:NextFunction) => await controller.forgotPassWord(req, res,next));
userRouter.post('/verify-forgot-otp', async (req: Request, res: Response,next:NextFunction) => await controller.VerifyForgotOtp(req, res,next));
userRouter.post('/resend-otp',async(req:Request,res:Response,next:NextFunction) => await controller.resendOTP(req,res,next));
userRouter.post('/handlePayment',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.createStripeSession(req,res,next));
userRouter.put('/update-newpassword',async(req: Request, res: Response,next:NextFunction) => await controller.updateNewPassword(req, res,next));
userRouter.get('/profile',userAuth(["user"]),async (req: Request, res: Response,next:NextFunction) => await controller.getProfile(req, res,next));
userRouter.put('/editUser',userAuth(["user"]),async (req:Request,res:Response,next:NextFunction) => await controller.editUser(req,res,next));
userRouter.post('/addAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.addAddress(req,res,next));
userRouter.put('/setDefaultAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.setDefaultAddress(req,res,next));
userRouter.put('/editAddress',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.editAddress(req,res,next));
userRouter.post('/registerService',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.registerService(req,res,next));
userRouter.get('/getAllServices',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) =>await controller.getAllServices(req,res,next));//getting all service which is provided by the website
userRouter.get('/getAllUserRegisteredServices',userAuth(["user"]),  async(req:Request,res:Response,next:NextFunction) => await controller.getAllUserRegisteredServices(req,res,next)); //getting all compliantes registrerd by user 
userRouter.get('/getImageUrl',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.getImageUrl(req,res,next));
userRouter.get('/getPresignedUrl',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => controller.getPresignedUrl(req,res,next));

userRouter.get('/getUserRegisteredServiceDetailsById',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.getUserRegisteredServiceDetailsById(req,res,next));
userRouter.get('/getMechanicDetails',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.getMechanicDetails(req,res,next));
userRouter.get('/getService/:id',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => controller.getService(req,res,next));
userRouter.get('/successPayment',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.successPayment(req,res,next));
userRouter.post('/updateUserLocation',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.updateUserLocation(req,res,next));
userRouter.post('/report',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.createReport(req,res,next));
// userRouter.get('/report',userAuth(["user"]),async(req:Request,res:Response,next:NextFunction) => await controller.getAllreport(req,res,next));



export default userRouter;