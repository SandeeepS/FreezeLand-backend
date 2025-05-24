import express ,{ Request,Response,NextFunction,} from "express";
import adminController from "../controllers/adminController";
import AdminService from "../services/AdminServices";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import adminAuth from "../middlewares/adminAuthMidd";
import UserRepository from "../repositories/userRepository";
import MechRepository from "../repositories/mechRepository";
import ServiceRepository from "../repositories/serviceRepository";
import DeviceRepository from "../repositories/deviceRepository";
import OrderServices from "../services/orderServices";
import OrderRepository from "../repositories/orderRepository";
import ConcernService from "../services/concernService";
import ConcernRepository from "../repositories/concernRepository";

const adminRouter = express.Router();
const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const userRepository = new UserRepository();
const mechRepository = new MechRepository();
const serviceRepository = new ServiceRepository();
const deviceRepository = new DeviceRepository();
const orderRepository = new OrderRepository()
const concernRepository = new ConcernRepository();
const adminService: AdminService = new AdminService(adminReopsitory,userRepository,mechRepository,serviceRepository,deviceRepository,concernRepository, encrypt, createjwt);
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
adminRouter.get('/getMechanicById/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getMechanicById(req,res,next));
adminRouter.put('/listUnlistServices/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.listUnlistServices(req,res,next));
adminRouter.put('/listUnlistDevices/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.listUnlistDevices(req,res,next));
adminRouter.put('/deleteService/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.deleteService(req,res,next));
adminRouter.put('/deleteDevice/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.deleteDevice(req,res,next));
adminRouter.put('/editExistService',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.editExistingService(req,res,next));
adminRouter.get('/getImageUrl', async(req:Request,res:Response,next:NextFunction) => await controller.getImageUrl(req,res,next));
adminRouter.put('/updateApprove',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.updateApprove(req,res,next))
adminRouter.get('/getAllComplaints',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getAllComplaints(req,res,next));
adminRouter.get('/getComplaintById/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => controller.getComplaintById(req,res,next));
adminRouter.post('/cancelComplaint',adminAuth(['admin']),async(req:Request,res:Response,next:NextFunction) => controller.cancelComplaint(req,res,next));

export default adminRouter;