import express ,{ Request,Response,NextFunction, response} from "express";
import adminController from "../controllers/adminController";
import AdminService from "../services/adminServices";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import adminAuth from "../middlewares/adminAuthMidd";


const adminRouter = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const adminService: AdminService = new AdminService(adminReopsitory, encrypt, createjwt);
const controller = new adminController(adminService);


adminRouter.post('/login', async (req: Request, res: Response,next:NextFunction) => controller.adminLogin(req, res,next));
adminRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => controller.adminLogout(req, res,next));
adminRouter.get('/users',  async (req: Request, res: Response,next:NextFunction) => controller.getUserList(req, res,next));
adminRouter.get('/mechanics',async (req:Request,res:Response,next:NextFunction) => controller.getMechList(req,res,next));

export default adminRouter;