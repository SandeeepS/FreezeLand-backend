import express,{Router,Request,Response,NextFunction} from 'express'
import Encrypt from '../utils/comparePassword';
import MechRepository from '../repositories/mechRepository';
import mechController from '../controllers/mechController';
import { CreateJWT } from '../utils/generateToken';
import mechService from '../services/mechServices';

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const mechRouter:Router = express.Router();
const mechRepository = new MechRepository();
const mechServices = new mechService(mechRepository,createjwt,encrypt);
const controller = new mechController(mechServices);

mechRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogin(req,res,next));
mechRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await controller.mechSignup(req,res,next));
mechRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.veryfyMechOtp(req,res,next));
mechRouter.post('/forgot-password',async(req:Request,res:Response,next:NextFunction) => await controller.forgotResentOtpMech(req,res,next));
mechRouter.post('/verify-forgot-otp',async(req:Request,res:Response,next:NextFunction) => await controller.VerifyForgotOtpMech(req,res,next));
mechRouter.put('/update-newpassword',async(req:Request,res:Response,next:NextFunction) => await controller.updateNewPasswordMech(req,res,next));
mechRouter.get('/logout',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogout(req,res,next));

export default mechRouter;