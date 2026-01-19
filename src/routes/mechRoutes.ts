import express,{Router,Request,Response,NextFunction} from 'express'
import Encrypt from '../utils/comparePassword';
import MechRepository from '../repositories/mechRepository';
import { CreateJWT } from '../utils/generateToken';
import mechService from '../services/mechServices';
import mechAuth from '../middlewares/mechAuthMidd';
import { Email } from '../utils/email';
import { GenerateOTP } from '../utils/generateOtp';
import RoomRepository from '../repositories/roomRepository';
import ConcernRepository from '../repositories/concernRepository';
import ReportService from '../services/reportService';
import ReportRepository from '../repositories/reportRepository';
import MechanicAuthController from '../controllers/mechanic/mechanicAuth.controller';
import MechanicProfileController from '../controllers/mechanic/mechanicProfile.controller';
import MechanicServiceController from '../controllers/mechanic/mechanicService.controller';
import MechanicChatController from '../controllers/mechanic/mechanicChat.controller';
import MechanicController from '../controllers/mechanic/mechanic.controller';

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const mechanicRouter:Router = express.Router();
const mechRepository = new MechRepository();
const roomRepository = new RoomRepository();
const concernRepository = new ConcernRepository();
const generateOTP  = new GenerateOTP();
const email = new Email(generateOTP);
const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const mechServices = new mechService(mechRepository,concernRepository,roomRepository,createjwt,encrypt,email);
const mechanicController = new MechanicController(mechServices,reportService,email);
const mechanicAuthController = new MechanicAuthController(mechServices,email);
const mechanicProfileController = new MechanicProfileController(mechServices);
const mechanicServiceController = new MechanicServiceController(mechServices);
const mechanciChatController = new MechanicChatController(mechServices);

mechanicRouter.post('/login',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.mechLogin(req,res,next)); 
mechanicRouter.post('/signup',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.mechSignup(req,res,next));
mechanicRouter.post('/veryfy-otp',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.veryfyMechOtp(req,res,next));
mechanicRouter.post('/resend-otp',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.resendOTP(req,res,next)); 
mechanicRouter.post('/forgot-password',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.forgotPasswordMech(req,res,next));
mechanicRouter.post('/verify-forgot-otp',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.VerifyForgotOtpMech(req,res,next));
mechanicRouter.put('/update-newpassword',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.updateNewPasswordMech(req,res,next));
mechanicRouter.get('/logout',async(req:Request,res:Response,next:NextFunction) => await mechanicAuthController.mechLogout(req,res,next));

mechanicRouter.post('/verifyMechanic',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.verifyMechanic(req,res,next));
mechanicRouter.put('/editMechanic',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.editMechanic(req,res,next));
mechanicRouter.post('/addMechAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.addAddress(req,res,next));
mechanicRouter.get('/getMechanicAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.getMechanicAddress(req,res,next));
mechanicRouter.put('/editAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.editAddress(req,res,next));
mechanicRouter.get('/getMechanicDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.getMechanicDetails(req,res,next));
mechanicRouter.put('/handleRemoveMechAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.handleRemoveMechAddress(req,res,next));
mechanicRouter.put('/setDefaultAddress',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicProfileController.setDefaultAddress(req,res,next));

mechanicRouter.put('/updateWorkAssigned',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.updateWorkAssigned(req,res,next));
mechanicRouter.get('/getAllAcceptedServices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.getAllAcceptedServices(req,res,next));
mechanicRouter.put('/updateComplaintStatus',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.updateComplaintStatus(req,res,next));
mechanicRouter.post('/updateWorkDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.updateWorkDetails(req,res,next));
mechanicRouter.get('/getAllCompletedServices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.getAllCompletedServices(req,res,next));
mechanicRouter.get('/getAllUserRegisteredServices',mechAuth(["mechanic"]),  async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.getAllUserRegisteredServices(req,res,next)); //getting all compliantes registrerd by user 
mechanicRouter.get('/getComplaintDetails',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicServiceController.getComplaintDetails(req,res,next));

mechanicRouter.post("/createRoom",mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanciChatController.createRoom(req,res,next));
mechanicRouter.get('/getAllMechanics',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicController.getAllMechanics(req,res,next));
mechanicRouter.get('/getAllDevices',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) =>await mechanicController.getAllDevices(req,res,next));
mechanicRouter.get('/getS3SingUrlForMechCredinential',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicController.getS3SingUrlForMechCredinential(req,res,next));

mechanicRouter.get('/getImageUrl',mechAuth(["mechanic"]), async(req:Request,res:Response,next:NextFunction) => await mechanicController.getImageUrl(req,res,next));
mechanicRouter.post('/report',mechAuth(["mechanic"]),async(req:Request,res:Response,next:NextFunction) => await mechanicController.createReport(req,res,next));







export default mechanicRouter;