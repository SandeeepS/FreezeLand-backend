import { AdminInterface } from "../models/adminModel";
import { comService } from "./comServices";
import AdminRepository from "../repositories/adminRepository";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import Encrypt from "../utils/comparePassword";
import { CreateJWT } from "../utils/generateToken";
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;


class AdminService implements comService<AdminInterface> {
  constructor(
    private adminRepository: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) {}

  async adminLogin(email: string, password: string): Promise<any> {
    try {
      console.log("entered in the admin login");
      const admin = await this.adminRepository.isAdminExist(email);

      if (admin?.password && password) {
        const passwordMatch = await this.encrypt.compare(
          password,
          admin.password as string
        );
        if (passwordMatch) {
          const token = this.createjwt.generateToken(admin?.id);
          const refreshToken = this.createjwt.generateRefreshToken(admin?.id);
          console.log("admin is exist", admin);
          return {
            status: STATUS_CODES.OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: admin,
              adminId: admin.id,
              token: token,
              refreshToken: refreshToken,
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
    } catch (error) {
      console.log("error occured while login admin");
      console.log(error as Error);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: "Internal server Error!",
        },
      } as const;
    }
  }
}
export default AdminService;
