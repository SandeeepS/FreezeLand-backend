import express,{Router,Request,Response,NextFunction} from 'express'
import Encrypt from '../utils/comparePassword';
import MechRepository from '../repositories/mechRepository';
import { CreateJWT } from '../utils/generateToken';
import mechService from '../services/mechServices';
import { Email } from '../utils/email';
import { GenerateOTP } from '../utils/generateOtp';
import RoomRepository from '../repositories/roomRepository';
import ConcernRepository from '../repositories/concernRepository';
import MechanicChatController from '../controllers/mechanic/mechanicChat.controller';

const encrypt = new Encrypt();
const createjwt = new CreateJWT();
const chatRouter:Router = express.Router();
const mechRepository = new MechRepository();
const roomRepository = new RoomRepository();
const concernRepository = new ConcernRepository();
const generateOTP  = new GenerateOTP();
const email = new Email(generateOTP);
const mechServices = new mechService(mechRepository,concernRepository,roomRepository,createjwt,encrypt,email);
const mechanicChatController = new MechanicChatController(mechServices)

chatRouter.post("/createRoom",async(req:Request,res:Response,next:NextFunction) => await mechanicChatController.createRoom(req,res,next));
chatRouter.get('/getComplaintDetails',async(req:Request,res:Response,next:NextFunction) => await mechanicChatController.getComplaintDetails(req,res,next));

export default chatRouter;