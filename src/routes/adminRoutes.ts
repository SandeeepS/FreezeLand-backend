import express ,{ Request,Response,NextFunction,} from "express";
import adminController from "../controllers/adminController";
import AdminService from "../services/AdminServices";
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
adminRouter.get('/users',  async (req: Request, res: Response,next:NextFunction) => controller.getUserList(req, res,next));
adminRouter.get('/mechanics',async (req:Request,res:Response,next:NextFunction) => controller.getMechList(req,res,next));
adminRouter.put('/users/block/:userId', async (req: Request, res: Response,next:NextFunction) => controller.blockUser(req, res,next));
adminRouter.put('/users/delete/:userId', async (req: Request, res: Response,next:NextFunction) => controller.deleteUser(req, res,next));
adminRouter.put('/mech/block/:mechId',  async (req: Request, res: Response,next:NextFunction) => controller.blockMech(req, res,next));
adminRouter.put('/mech/delete/:mechId', async (req: Request, res: Response,next:NextFunction) => controller.deleteMech(req, res,next));
adminRouter.post('/addNewService',async(req:Request,res:Response,next:NextFunction) => controller.addNewServices(req,res,next));
adminRouter.get('/getAllServices',async(req:Request,res:Response,next:NextFunction) => controller.getAllServices(req,res,next));
adminRouter.get('/getService/:id',async(req:Request,res:Response,next:NextFunction) => controller.getService(req,res,next));
adminRouter.put('/listUnlistServices/:serviceId',async(req:Request,res:Response,next:NextFunction) => controller.listUnlistServices(req,res,next));
adminRouter.put('/deleteService/:serviceId',async(req:Request,res:Response,next:NextFunction) => controller.deleteService(req,res,next));
adminRouter.put('/editExistService',async(req:Request,res:Response,next:NextFunction) => controller.editExistingService(req,res,next));


export default adminRouter;