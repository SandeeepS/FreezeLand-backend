import express,{Router,Request,Response} from 'express'
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

mechRouter.post('/login',async(req:Request,res:Response) => await controller.mechLogin(req,res));
mechRouter.post('/signup',async(req:Request,res:Response) => await controller.mechSignup(req,res));
mechRouter.get('/logout',async(req:Request,res:Response) => await controller.mechLogout(req,res));


export default mechRouter;