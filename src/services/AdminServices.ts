import { Request } from "express";
import AdminModel, { AdminInterface } from "../models/adminModel";
import AdminRepository from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";

class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) {}

  async adminLogin(email: string, password: string): Promise<any> {
    console.log("entered in the admin login");
    const admin = await this.adminRepository.isAdminExist(email);
    if (admin) {
      console.log("admin login successfull");
      return {
        status: STATUS_CODES.OK,
        data: {
          success: true,
          message: "Authentication Successful !",
          data: admin,
          adminId: admin.id,
        },
      };
    } else {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        data: {
          success: false,
          message: "Incorrect password!",
        },
      } as const;
    }
  }
}
export default AdminService;
