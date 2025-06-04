import express,{Router,Request,Response,NextFunction} from 'express'
import Encrypt from '../utils/comparePassword';
import MechRepository from '../repositories/mechRepository';
import mechController from '../controllers/mechController';
import { CreateJWT } from '../utils/generateToken';
import mechService from '../services/mechServices';
import mechAuth from '../middlewares/mechAuthMidd';
import { Email } from '../utils/email';
import { GenerateOTP } from '../utils/generateOtp';
import RoomRepository from '../repositories/roomRepository';
import ConcernRepository from '../repositories/concernRepository';
import ReportService from '../services/reportService';
import ReportRepository from '../repositories/reportRepository';

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const mechRouter:Router = express.Router();
const mechRepository = new MechRepository();
const roomRepository = new RoomRepository();
const concernRepository = new ConcernRepository();
const generateOTP  = new GenerateOTP();
const email = new Email(generateOTP);
const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const mechServices = new mechService(mechRepository,concernRepository,roomRepository,createjwt,encrypt,email);
const controller = new mechController(mechServices,reportService,encrypt,createjwt,email);

mechRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogin(req,res,next)); 
mechRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await controller.mechSignup(req,res,next));
mechRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await controller.veryfyMechOtp(req,res,next));
mechRouter.post('/resend-otp',async(req:Request,res:Response,next:NextFunction) => await controller.resendOTP(req,res,next)); 
mechRouter.post('/forgot-password',async(req:Request,res:Response,next:NextFunction) => await controller.forgotPasswordMech(req,res,next));
mechRouter.post('/verify-forgot-otp',async(req:Request,res:Response,next:NextFunction) => await controller.VerifyForgotOtpMech(req,res,next));
mechRouter.post("/createRoom",mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.createRoom(req,res,next));
mechRouter.put('/update-newpassword',async(req:Request,res:Response,next:NextFunction) => await controller.updateNewPasswordMech(req,res,next));
mechRouter.get('/getAllMechanics',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getAllMechanics(req,res,next));
mechRouter.get('/getAllDevices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) =>await controller.getAllDevices(req,res,next));
mechRouter.post('/verifyMechanic',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.verifyMechanic(req,res,next));
mechRouter.get('/getMechanicDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getMechanicDetails(req,res,next));
mechRouter.get('/getS3SingUrlForMechCredinential',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getS3SingUrlForMechCredinential(req,res,next));
mechRouter.get('/getAllUserRegisteredServices',mechAuth(["mechanic"]),  async(req:Request,res:Response,next:NextFunction) => await controller.getAllUserRegisteredServices(req,res,next)); //getting all compliantes registrerd by user 
mechRouter.get('/getComplaintDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getComplaintDetails(req,res,next));
mechRouter.get('/getImageUrl',mechAuth(["mechanic"]), async(req:Request,res:Response,next:NextFunction) => await controller.getImageUrl(req,res,next));
mechRouter.put('/updateWorkAssigned',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.updateWorkAssigned(req,res,next));
mechRouter.get('/getAllAcceptedServices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getAllAcceptedServices(req,res,next));
mechRouter.put('/updateComplaintStatus',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.updateComplaintStatus(req,res,next));
mechRouter.post('/updateWorkDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.updateWorkDetails(req,res,next));
mechRouter.get('/getAllCompletedServices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.getAllCompletedServices(req,res,next));
mechRouter.put('/editMechanic',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.editMechanic(req,res,next));
mechRouter.post('/addMechAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.addAddress(req,res,next));
mechRouter.put('/editAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.editAddress(req,res,next));
mechRouter.post('/report',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await controller.createReport(req,res,next));
mechRouter.get('/logout',async(req:Request,res:Response,next:NextFunction) => await controller.mechLogout(req,res,next));





export default mechRouter;