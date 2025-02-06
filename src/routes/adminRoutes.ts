import express ,{ Request,Response,NextFunction,} from "express";
import adminController from "../controllers/adminController";
import AdminService from "../services/AdminServices";
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
adminRouter.get('/users',adminAuth(["admin"]),  async (req: Request, res: Response,next:NextFunction) => controller.getUserList(req, res,next));
adminRouter.get('/mechanics',adminAuth(["admin"]),async (req:Request,res:Response,next:NextFunction) => controller.getMechList(req,res,next));
adminRouter.put('/users/block/:userId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) => controller.blockUser(req, res,next));
adminRouter.put('/users/delete/:userId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) => controller.deleteUser(req, res,next));
adminRouter.put('/mech/block/:mechId',adminAuth(["admin"]),  async (req: Request, res: Response,next:NextFunction) => controller.blockMech(req, res,next));
adminRouter.put('/mech/delete/:mechId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) => controller.deleteMech(req, res,next));
adminRouter.post('/addNewService',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.addNewServices(req,res,next));
adminRouter.get('/getPresignedUrl',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getPresignedUrl(req,res,next));
adminRouter.post('/addNewDevice',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.addNewDevice(req,res,next));
adminRouter.get('/getAllServices',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getAllServices(req,res,next));
adminRouter.get('/getAllDevices',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getAllDevices(req,res,next));
adminRouter.get('/getService/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getService(req,res,next));
adminRouter.put('/listUnlistServices/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.listUnlistServices(req,res,next));
adminRouter.put('/listUnlistDevices/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.listUnlistDevices(req,res,next));
adminRouter.put('/deleteService/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.deleteService(req,res,next));
adminRouter.put('/deleteDevice/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.deleteDevice(req,res,next));
adminRouter.put('/editExistService',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.editExistingService(req,res,next));



export default adminRouter;