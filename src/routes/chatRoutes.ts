import express,{Router,Request,Response,NextFunction} from 'express';
import ChatRepository from '../repositories/chatRepository';
import ChatServices from '../services/chatServices';
import ChatController from '../controllers/chatController';
import ConcernRepository from '../repositories/concernRepository';

const chatRouters:Router = express.Router();
const chatRepository = new ChatRepository();
const concernRepository = new ConcernRepository();
const chatService = new ChatServices(chatRepository,concernRepository);
const controller = new ChatController(chatService);

chatRouters.get('/getComplaintDetails',async(req:Request,res:Response,next:NextFunction) => await controller.getComplaintDetails(req,res,next));

export default chatRouters;