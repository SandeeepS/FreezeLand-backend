import { STATUS_CODES } from "../constants/httpStatusCodes";
import { MechInterface } from "../models/mechModel";
import MechRepository from "../repositories/mechRepository";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";
import { MechResponseInterface } from "../interfaces/serviceInterfaces/InMechService";
import Cryptr from "cryptr";

const { OK, UNAUTHORIZED } = STATUS_CODES;
class mechService implements comService<MechResponseInterface> {
  constructor(
    private mechRepository: MechRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}

  // async signupMech(mechData: MechInterface): Promise<any> {
  //   try {
  //     console.log("Entered in mechanic Service");
  //     const {name,email,password,phone} = mechData;
  //     const secret_key:string | undefined = process.env.CRYPTR_SECRET
  //     if(!secret_key){
  //       throw new Error("Encrption secret key is not defined in the environment");
  //     }

  //     const cryptr = new Cryptr(secret_key,{ encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
  //     const newPassword = cryptr.encrypt(password);
  //     const newDetails: Partial<MechInterface> = {
  //              name:name,
  //              password:newPassword,
  //              email:email,
  //              phone:phone
  //     }
  //     const mechanic = await this.mechRepository.saveMechanic(newDetails);

  //     if (mechanic) {
  //       console.log("mechanic is registered ");
  //       return {
  //         status: OK,
  //         data: {
  //           success: true,
  //           message: "mechanic is successfully registered ",
  //           data: mechanic,
  //         },
  //       };
  //     } else {
  //       console.log("mechanic is not registered");
        
  //     }
  //   } catch (error) {
  //     console.log(error as Error);
  //   }
  // }


  async signupMech(mechData: MechInterface): Promise<MechInterface | null> {
    try {
        return await this.mechRepository.emailExistCheck(mechData.email);
    } catch (error) {
        console.log(error as Error);
        throw error
    }

}


async saveMech(mechData: MechInterface): Promise<MechResponseInterface | undefined> {
  try {
          console.log("Entered in mech Service and the mechData is ",mechData);
      const {name,email,password,phone} = mechData;
      const secret_key :string | undefined= process.env.CRYPTR_SECRET
      if(!secret_key){
        throw new Error("Encrption secret key is not defined in the environment");
      }
      const cryptr = new Cryptr(secret_key,{ encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
      const newPassword = cryptr.encrypt(password);
      const newDetails: Partial<MechInterface> = {
               name:name,
               password:newPassword,
               email:email,
               phone:phone
      }
      console.log("new Encypted password with data is ",newDetails);
      const mech = await this.mechRepository.saveMechanic(newDetails);
      if (mech) {
          const token = this.createjwt.generateToken(mech?.id);
          const  refresh_token = this.createjwt.generateRefreshToken(mech?.id);
          console.log("token is ",token);
          console.log("refresh",  refresh_token);
          return {
              status: OK,
              data: {
                  success: true,
                  message: 'Success',
                  mechId: mechData.id,
                  token: token,
                  data: mech,
                  refresh_token
              }
          }
      }
  } catch (error) {
      console.log(error as Error);
      throw error
  }
}

  async mechLogin(email: string, password: string): Promise<MechResponseInterface> {
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
            refresh_token: refreshToken,
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
              refresh_token: refreshToken,
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
      else {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "Authentication failed...",
          },
        } as const;
      }
      
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }


  async getUserByEmail(email: string): Promise<MechInterface | null> {
    try {
      return this.mechRepository.emailExistCheck(email);
    } catch (error) {
      console.log(error as Error)
      throw error;
    }
  }

  async updateNewPassword(password: string, userId: string) {
    try {
      const secret_key: string | undefined = process.env.CRYPTR_SECRET;
      if (!secret_key) {
        throw new Error(
          "Encrption secret key is not defined in the environment"
        );
      }
      const cryptr = new Cryptr(secret_key, {
        encoding: "base64",
        pbkdf2Iterations: 10000,
        saltLength: 10,
      });
      const newPassword = cryptr.encrypt(password);

      return await this.mechRepository.updateNewPassword(newPassword, userId);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }
}

export default mechService;
