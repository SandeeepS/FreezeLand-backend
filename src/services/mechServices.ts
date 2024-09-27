import { STATUS_CODES } from "../constants/httpStatusCodes";
import { MechInterface } from "../models/mechModel";
import MechRepository from "../repositories/mechRepository";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;
class mechService implements comService<MechInterface> {
  constructor(
    private mechRepository: MechRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}

  async signupMech(mechData: MechInterface): Promise<any> {
    try {
      console.log("Entered in mechanic Service");
      const mechanic = await this.mechRepository.saveMechanic(mechData);
      if (mechanic) {
        console.log("mechanic is registered ");
        return {
          status: OK,
          data: {
            success: true,
            message: "mechanic is successfully registered ",
            data: mechanic,
          },
        };
      } else {
        console.log("mechanic is not registered");
        
      }
    } catch (error) {
      console.log(error as Error);
    }
  }

  async mechLogin(email: string, password: string): Promise<any> {
    try {
      const mech: MechInterface | null =
        await this.mechRepository.emailExistCheck(email);
      const token = this.createjwt.generateToken(mech?.id);
      const refreshToken = this.createjwt.generateRefreshToken(mech?.id);
      if (mech && mech.isBlocked) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "You have been blocked by the mech !",
            token: token,
            data: mech,
            refreshToken: refreshToken,
          },
        } as const;
      }
      if (mech?.password && password) {
        console.log("enterd password is ", password);
        const passwordMatch = await this.encrypt.compare(
          password,
          mech.password as string
        );
        if (passwordMatch) {
          const token = this.createjwt.generateToken(mech.id);
          const refreshToken = this.createjwt.generateRefreshToken(mech.id);
          return {
            status: OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: mech,
              mechId: mech.id,
              token: token,
              refreshToken: refreshToken,
            },
          } as const;
        } else {
          return {
            status: UNAUTHORIZED,
            data: {
              success: false,
              message: "Authentication failed...",
            },
          } as const;
        }
      }
    } catch (error) {
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

export default mechService;
