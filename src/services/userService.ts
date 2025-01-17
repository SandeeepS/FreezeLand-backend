import { STATUS_CODES } from "../constants/httpStatusCodes";
import UserRepository from "../repositories/userRepository";
import { UserResponseInterface } from "../interfaces/serviceInterfaces/InUserService";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import {
  UserSignUpDTO,
  SaveUserDTO,
  UserLoginDTO,
  SaveUserResponse,
  NewDetailsDTO,
  UserLoginResponse,
  EmailExistCheckDTO,
  EmailExistCheckResponse,
  GetProfileDTO,
  GetProfileResponse,
  EditUserDTO,
  AddUserAddressDTO,
  EditAddressDTO,
  SetUserDefaultAddressDTO,
  GetUserByEmail,
  GenerateTokenDTO,
  GenerateRefreshToken,
  RegisterServiceDTO,
} from "../interfaces/DTOs/User/IService.dto";
dotenv.config();

const { OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
class userService implements comService<UserResponseInterface> {
  constructor(
    private userRepository: UserRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}

  async isUserExist(
    userData: UserSignUpDTO
  ): Promise<EmailExistCheckResponse | null> {
    try {
      const { email } = userData;
      return await this.userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async saveUser(userData: SaveUserDTO): Promise<SaveUserResponse> {
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
      const newDetails: NewDetailsDTO = {
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
          success: true,
          message: "Success",
          userId: userData.id,
          token: token,
          data: user,
          refresh_token,
        };
      } else {
        return {
          success: false,
          message: "false",
        };
      }
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async userLogin(userData: UserLoginDTO): Promise<UserLoginResponse> {
    try {
      const { email } = userData;
      const user: EmailExistCheckDTO | null =
        await this.userRepository.emailExistCheck({ email });
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
      if (user?.password && userData.password) {
        console.log("enterd password is ", userData.password);
        const passwordMatch = await this.encrypt.compare(
          userData.password,
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

  async getUserByEmail(
    data: GetUserByEmail
  ): Promise<EmailExistCheckResponse | null> {
    try {
      const { email } = data;
      return this.userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("error occured while getUserEmail in the userService");
      throw error;
    }
  }

  generateToken(data: GenerateTokenDTO): string | undefined {
    const { payload } = data;
    if (payload) return this.createjwt.generateToken(payload);
  }

  generateRefreshToken(data: GenerateRefreshToken): string | undefined {
    const { payload } = data;
    if (payload) return this.createjwt.generateRefreshToken(payload);
  }

  async hashPassword(password: string) {
    return await this.encrypt.hashPassword(password);
  }

  async getProfile(data: GetProfileDTO): Promise<GetProfileResponse> {
    try {
      const {id} = data
      console.log("idddddddddddddddddddddd",id);
      if (!id)
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "User ID is missing",
          },
        } as const;
      const user = await this.userRepository.getUserById(data.id);
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
      throw new Error("Error while getting the user Profile ");
        }
  }

  //getting the user registered complaint details
  async getAllRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<unknown> {
    try {
      const data = await this.userRepository.getAllUserRegisteredServices(
        page,
        limit,
        searchQuery
      );
      return data;
    } catch (error) {
      console.log(
        "Error occured while fetching the user registerd complaint in the userSercvice ",
        error as Error
      );
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
      return await this.userRepository.updateNewPassword(newPassword, userId);
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async editUser(data: EditUserDTO) {
    try {
      const { _id, name, phone } = data;
      return this.userRepository.editUser({ _id, name, phone });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async AddUserAddress(data: AddUserAddressDTO) {
    try {
      const { _id, values } = data;
      return await this.userRepository.addAddress({ _id, values });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async editAddress(data: EditAddressDTO) {
    try {
      const { _id, addressId, values } = data;
      return await this.userRepository.editAddress({ _id, addressId, values });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async setUserDefaultAddress(data: SetUserDefaultAddressDTO) {
    try {
      const { userId, addressId } = data;
      console.log("entered in the userService ");
      return await this.userRepository.setDefaultAddress({ userId, addressId });
    } catch (error) {
      console.log(error as Error);
    }
  }

  async registerService(data: RegisterServiceDTO) {
    try {
      console.log("entered in the userService for register Service");
      return await this.userRepository.registerService(data);
    } catch (error) {
      console.log(error as Error);
    }
  }
}

export default userService;
