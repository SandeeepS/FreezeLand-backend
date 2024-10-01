import { STATUS_CODES } from "../constants/httpStatusCodes";
import { UserInterface } from "../models/userModel";
import UserRepository from "../repositories/userRepository";
import { UserResponseInterface } from "../interfaces/serviceInterfaces/InUserService";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";
import { CreateUserDTO } from "../dto/user.dto.";
import dotenv from "dotenv";
import Cryptr = require("cryptr");

dotenv.config();

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;
class userService implements comService<CreateUserDTO> {
  constructor(
    private userRepository: UserRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}
  // async signupUser(userData: UserInterface): Promise<any> {
  //   try {
  //     console.log("Entered in user Service and the userData is ",userData);
  //     const {name,email,password,phone} = userData;
  //     const secret_key :string | undefined= process.env.CRYPTR_SECRET
  //     if(!secret_key){
  //       throw new Error("Encrption secret key is not defined in the environment");
  //     }
  //     const cryptr = new Cryptr(secret_key,{ encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
  //     const newPassword = cryptr.encrypt(password);
  //     const newDetails: Partial<UserInterface> = {
  //              name:name,
  //              password:newPassword,
  //              email:email,
  //              phone:phone
  //     }
  //     console.log("new Encypted password with data is ",newDetails);
  //     const user = await this.userRepository.saveUser(newDetails);
  //     if (user) {
  //       console.log("user is registered ");
  //       return {
  //         status: OK,
  //         data: {
  //           success: true,
  //           message: "User is successfully registered ",
  //           data: user,
  //         },
  //       };
  //     } else {
  //       console.log("User is not registered");
  //     }
  //   } catch (error) {
  //     console.log(error as Error);
  //   }
  // }

  async userSignup(userData: UserInterface): Promise<UserInterface | null> {
    try {
      return await this.userRepository.emailExistCheck(userData.email);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async saveUser(
    userData: UserInterface
  ): Promise<UserResponseInterface | undefined> {
    try {
      console.log("Entered in user Service and the userData is ", userData);
      const { name, email, password, phone } = userData;
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
      const newDetails: Partial<UserInterface> = {
        name: name,
        password: newPassword,
        email: email,
        phone: phone,
      };
      console.log("new Encypted password with data is ", newDetails);
      const user = await this.userRepository.saveUser(newDetails);
      if (user) {
        const token = this.createjwt.generateToken(user?.id);
        const refresh_token = this.createjwt.generateRefreshToken(user?.id);
        console.log("token is ", token);
        console.log("refresh", refresh_token);
        return {
          status: OK,
          data: {
            success: true,
            message: "Success",
            userId: userData.id,
            token: token,
            data: user,
            refresh_token,
          },
        };
      }
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async userLogin(email: string, password: string): Promise<any> {
    try {
      const user: UserInterface | null =
        await this.userRepository.emailExistCheck(email);
      const token = this.createjwt.generateToken(user?.id);
      const refreshToken = this.createjwt.generateRefreshToken(user?.id);
      if (user && user.isBlocked) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "You have been blocked by the admin !",
            token: token,
            data: user,
            refreshToken: refreshToken,
          },
        } as const;
      }
      if (user?.password && password) {
        console.log("enterd password is ", password);
        const passwordMatch = await this.encrypt.compare(
          password,
          user.password as string
        );
        if (passwordMatch) {
          const token = this.createjwt.generateToken(user.id);
          const refreshToken = this.createjwt.generateRefreshToken(user.id);
          return {
            status: OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: user,
              userId: user.id,
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
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserInterface | null> {
    try {
      return this.userRepository.emailExistCheck(email);
    } catch (error) {
      throw error;
    }
  }

  getProfile(id: string | undefined): Promise<UserInterface | null> | null {
    try {
        if (!id) return null;
        return this.userRepository.getUserById(id);
    } catch (error) {
        console.log(error as Error);
        return null;
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

      return await this.userRepository.updateNewPassword(newPassword, userId);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }
}

export default userService;
