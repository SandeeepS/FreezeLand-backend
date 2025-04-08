import express,{Router,Request,Response,NextFunction} from 'express'
import Encrypt from '../utils/comparePassword';
import MechRepository from '../repositories/mechRepository';
import mechController from '../controllers/mechController';
import { CreateJWT } from '../utils/generateToken';
import mechService from '../services/mechServices';
import mechAuth from '../middlewares/mechAuthMidd';
import { Email } from '../utils/email';
import { GenerateOTP } from '../utils/generateOtp';

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const mechRouter:Router = express.Router();
const mechRepository = new MechRepository();
const generateOTP  = new GenerateOTP();
const email = new Email(generateOTP);
const mechServices = new mechService(mechRepository,createjwt,encrypt);
const controller = new mechController(mechServices,encrypt,createjwt,email);

mechRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogin(req,res,next));
mechRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await controller.mechSignup(req,res,next));
mechRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.veryfyMechOtp(req,res,next));
mechRouter.post('/forgot-password',async(req:Request,res:Response,next:NextFunction) => await controller.forgotResentOtpMech(req,res,next));
mechRouter.post('/verify-forgot-otp',async(req:Request,res:Response,next:NextFunction) => await controller.VerifyForgotOtpMech(req,res,next));
mechRouter.put('/update-newpassword',async(req:Request,res:Response,next:NextFunction) => await controller.updateNewPasswordMech(req,res,next));
mechRouter.get('/getAllMechanics',async(req:Request,res:Response,next:NextFunction) => await controller.getAllMechanics(req,res,next));
mechRouter.get('/getAllDevices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => controller.getAllDevices(req,res,next));
mechRouter.post('/verifyMechanic',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => controller.verifyMechanic(req,res,next));
mechRouter.get('/getMechanicDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getMechanicDetails(req,res,next));
mechRouter.get('/logout',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogout(req,res,next));
mechRouter.get('/getS3SingUrlForMechCredinential',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => controller.getS3SingUrlForMechCredinential(req,res,next));
mechRouter.get('/getAllUserRegisteredServices',mechAuth(["mechanic"]),  async(req:Request,res:Response,next:NextFunction) => await controller.getAllUserRegisteredServices(req,res,next)); //getting all compliantes registrerd by user 
mechRouter.get('/getComplaintDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getComplaintDetails(req,res,next));
mechRouter.get('/getImageUrl', async(req:Request,res:Response,next:NextFunction) => await controller.getImageUrl(req,res,next));
mechRouter.put('/updateWorkAssigned',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.updateWorkAssigned(req,res,next));
mechRouter.get('/getAllAcceptedServices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getAllAcceptedServices(req,res,next));


export default mechRouter;