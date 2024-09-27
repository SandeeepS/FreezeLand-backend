import express ,{ Request,Response} from "express";
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


adminRouter.post('/login', async (req: Request, res: Response) => controller.adminLogin(req, res));
adminRouter.get('/logout', async (req: Request, res: Response) => controller.adminLogout(req, res));

export default adminRouter;