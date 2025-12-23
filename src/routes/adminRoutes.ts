import express ,{ Request,Response,NextFunction,} from "express";
import AdminService from "../services/AdminServices";
import AdminRepository from "../repositories/adminRepository";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
import adminAuth from "../middlewares/adminAuthMidd";
import UserRepository from "../repositories/userRepository";
import MechRepository from "../repositories/mechRepository";
import ServiceRepository from "../repositories/serviceRepository";
import DeviceRepository from "../repositories/deviceRepository";
import ConcernRepository from "../repositories/concernRepository";
import ReportRepository from "../repositories/reportRepository";
import ReportService from "../services/reportService";
import AdminAuthController from "../controllers/admin/adminAuthController";
import AdminUserManagementController from "../controllers/admin/adminUserManagementController";
import AdminMechanicManagementController from "../controllers/admin/adminMechanicManagementController";
import AdminServiceController from "../controllers/admin/adminServiceController";
import AdminDeviceController from "../controllers/admin/adminDeviceController";
import AdminConcernController from "../controllers/admin/adminConcernController";
import AdminController from "../controllers/adminController";

const adminRouter = express.Router();
const encrypt = new Encrypt();
const createjwt = new CreateJWT()
const adminReopsitory = new AdminRepository();
const userRepository = new UserRepository();
const mechRepository = new MechRepository();
const serviceRepository = new ServiceRepository();
const reportRepository = new ReportRepository();
const deviceRepository = new DeviceRepository();
const concernRepository = new ConcernRepository();
const reportService = new ReportService(reportRepository);
const adminService: AdminService = new AdminService(adminReopsitory,userRepository,mechRepository,serviceRepository,deviceRepository,concernRepository, encrypt, createjwt);
const adminController = new AdminController(adminService,reportService);
const adminAuthController = new AdminAuthController(adminService);
const adminUserManagementController = new AdminUserManagementController(adminService);
const adminMechanicManagementController = new AdminMechanicManagementController(adminService);
const adminServiceController = new AdminServiceController(adminService);
const adminDeviceController = new AdminDeviceController(adminService);
const adminConcernController = new AdminConcernController(adminService);


adminRouter.post('/login', async (req: Request, res: Response,next:NextFunction) => adminAuthController.adminLogin(req, res,next));
adminRouter.get('/logout', async (req: Request, res: Response,next:NextFunction) => adminAuthController.adminLogout(req, res,next));

adminRouter.get('/users',adminAuth(["admin"]),  async (req: Request, res: Response,next:NextFunction) =>await adminUserManagementController.getUserList(req, res,next));
adminRouter.put('/users/block/:userId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) =>await adminUserManagementController.blockUser(req, res,next));
adminRouter.put('/users/delete/:userId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) =>await adminUserManagementController.deleteUser(req, res,next));

adminRouter.get('/mechanics',adminAuth(["admin"]),async (req:Request,res:Response,next:NextFunction) =>await adminMechanicManagementController.getMechList(req,res,next));
adminRouter.put('/mech/block/:mechId',adminAuth(["admin"]),  async (req: Request, res: Response,next:NextFunction) => await adminMechanicManagementController.blockMech(req, res,next));
adminRouter.put('/mech/delete/:mechId',adminAuth(["admin"]), async (req: Request, res: Response,next:NextFunction) => await adminMechanicManagementController.deleteMech(req, res,next));
adminRouter.get('/getMechanicById/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminMechanicManagementController.getMechanicById(req,res,next));

adminRouter.post('/addNewService',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.addNewServices(req,res,next));
adminRouter.get('/getAllServices',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.getAllServices(req,res,next));
adminRouter.get('/getService/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.getService(req,res,next));
adminRouter.put('/listUnlistServices/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.listUnlistServices(req,res,next));
adminRouter.put('/deleteService/:serviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.deleteService(req,res,next));
adminRouter.put('/editExistService',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminServiceController.editExistingService(req,res,next));

adminRouter.post('/addNewDevice',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminDeviceController.addNewDevice(req,res,next));
adminRouter.get('/getAllDevices',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminDeviceController.getAllDevices(req,res,next));
adminRouter.put('/listUnlistDevices/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminDeviceController.listUnlistDevices(req,res,next));
adminRouter.put('/deleteDevice/:deviceId',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminDeviceController.deleteDevice(req,res,next));

adminRouter.get('/getAllComplaints',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminConcernController.getAllComplaints(req,res,next));
adminRouter.get('/getComplaintById/:id',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminConcernController.getComplaintById(req,res,next));
adminRouter.post('/cancelComplaint',adminAuth(['admin']),async(req:Request,res:Response,next:NextFunction) => adminConcernController.cancelComplaint(req,res,next));

adminRouter.get('/getPresignedUrl',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) =>await adminController.getPresignedUrl(req,res,next));
adminRouter.get('/getImageUrl',adminAuth(["admin"]), async(req:Request,res:Response,next:NextFunction) => await adminController.getImageUrl(req,res,next));
adminRouter.put('/updateApprove',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) =>await adminController.updateApprove(req,res,next))

adminRouter.get('/report',adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminController.getAllReportByReporterRole(req,res,next));
adminRouter.put('/updateReportStatus' ,adminAuth(["admin"]),async(req:Request,res:Response,next:NextFunction) => await adminController.updateReportStatus(req,res,next))

export default adminRouter;