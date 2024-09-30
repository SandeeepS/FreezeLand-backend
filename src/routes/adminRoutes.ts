import express ,{ Request,Response,NextFunction} from "express";
import adminController from "../controllers/adminController";
import AdminService from "../services/adminServices";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";


const adminRouter = express.Router();

const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const adminService: AdminService = new AdminService(adminReopsitory, encrypt, createjwt);
const controller = new adminController(adminService);


adminRouter.post('/login', async (req: Request, res: Response,next:NextFunction) => controller.adminLogin(req, res,next));
adminRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => controller.adminLogout(req, res,next));

export default adminRouter;