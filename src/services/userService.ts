import { STATUS_CODES } from "../constants/httpStatusCodes";
import { UserInterface } from "../models/userModel";
import UserRepository from "../repositories/userRepository";
import { UserResponseInterface } from "../interfaces/serviceInterfaces/InUserService";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import User from "../interfaces/entityInterface/Iuser";
import { AddAddress } from "../interfaces/commonInterfaces/AddAddress";
import Service from "../interfaces/entityInterface/Iservices";

dotenv.config();

const { OK, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = STATUS_CODES;
class userService implements comService<UserResponseInterface> {
  constructor(
    private userRepository: UserRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}

  async userSignup(userData: UserInterface): Promise<UserInterface | null> {
    try {
      return await this.userRepository.emailExistCheck(userData.email);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async saveUser(userData: User): Promise<UserResponseInterface | undefined> {
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

  async userLogin(
    email: string,
    password: string
  ): Promise<UserResponseInterface> {
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
            refresh_token: refreshToken,
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
      return {
        status: UNAUTHORIZED,
        data: {
          success: false,
          message: "Invalid email or password.",
        },
      } as const;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserInterface | null> {
    try {
      return this.userRepository.emailExistCheck(email);
    } catch (error) {
      console.log("error occured while getUserEmail in the userService");
      throw error;
    }
  }

  generateToken(payload: string | undefined): string | undefined {
    if (payload) return this.createjwt.generateToken(payload);
  }

  generateRefreshToken(payload: string | undefined): string | undefined {
    if (payload) return this.createjwt.generateRefreshToken(payload);
  }

  async hashPassword(password: string) {
    return await this.encrypt.hashPassword(password);
  }

  async getProfile(id: string | undefined): Promise<UserResponseInterface> {
    try {
      if (!id)
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "User ID is missing",
          },
        } as const;
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        return {
          status: NOT_FOUND,
          data: {
            success: false,
            message: "User not found",
          },
        } as const;
      }

      return {
        status: OK,
        data: {
          success: true,
          message: "User profile retrieved successfully",
          data: user,
        },
      } as const;
    } catch (error) {
      console.log(error as Error);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: "An error occurred while retrieving user profile",
        },
      } as const;
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

  async editUser(_id: string, name: string, phone: number) {
    try {
      return this.userRepository.editUser(_id, name, phone);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async AddUserAddress(_id: string, values: AddAddress) {
    try {
      return await this.userRepository.addAddress(_id, values);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async editAddress(_id: string, addressId :string, values: AddAddress) {
    try {
      return await this.userRepository.editAddress(_id,addressId, values);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async setUserDefaultAddress(userId: string, addressId: string) {
    try {
      console.log("entered in the userService ");
      return await this.userRepository.setDefaultAddress(userId, addressId);
    } catch (error) {
      console.log(error as Error);
    }
  }

  async registerService(data:Service){
    try{
      console.log("entered in the userService for register Service");
      return await this.userRepository.registerService(data);
    }catch(error){
      console.log(error as Error);
      
    }
  }
}

export default userService;
