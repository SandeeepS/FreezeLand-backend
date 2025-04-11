import { STATUS_CODES } from "../constants/httpStatusCodes";

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
  ReturnUserdataDTO,
  GetServicesDTO,
  GetServiceResponse,
  AddUserAddressResponse,
  EditUserResponse,
  RegisterServiceResponse,
  UpdateNewPasswordDTO,
  UpdateNewPasswordResponse,
  EditAddressResponse,
  SetUserDefaultAddressResponse,
  getUserRegisteredServiceDetailsByIdResponse,
} from "../interfaces/DTOs/User/IService.dto";
import { IUserServices } from "../interfaces/IServices/IUserServices";
import { AddAddress } from "../interfaces/commonInterfaces/AddAddress";
import { IUserRepository } from "../interfaces/IRepository/IUserRepository";
import { ICreateJWT } from "../utils/generateToken";
import { compareInterface } from "../utils/comparePassword";
import {
  getMechanicDetailsDTO,
  getMechanicDetailsResponse,
} from "../interfaces/DTOs/Mech/IService.dto";
dotenv.config();

const { OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
class userService implements IUserServices {
  constructor(
    private userRepository: IUserRepository,
    private createjwt: ICreateJWT,
    private encrypt: compareInterface
  ) {
    this.userRepository = userRepository;
    this.createjwt = createjwt;
    this.encrypt = encrypt;
  }

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
      if (!secret_key){
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
      const user = await this.userRepository.saveUser({
        name,
        password,
        email,
        phone,
      });
      if (user && user?.role) {
        const userId = user._id.toString();
        const token = this.createjwt.generateToken(userId, user.role);
        const refresh_token = this.createjwt.generateRefreshToken(userId);
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
      const { email, password } = userData;
      console.log("Login attempt with email:", email);
      console.log("Password provided (length):", password?.length || 0);

      const user: EmailExistCheckDTO | null =
        await this.userRepository.emailExistCheck({ email });

      console.log("User found:", !!user);

      // If user doesn't exist
      if (!user?.id) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "Invalid email or password",
          },
        } as const;
      }

      // Create user data object that might be returned
      const returnUserData: ReturnUserdataDTO = {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isDeleted: user.isDeleted,
        isBlocked: user.isBlocked,
        profile_picture: user.profile_picture,
      };

      // Check if user is blocked
      if (user.isBlocked) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "Your account has been blocked by the admin",
          },
        } as const;
      }

      // Verify password
      console.log("User password exists:", !!user?.password);
      console.log("Password provided:", !!password);

      if (!user?.password || !password) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "Invalid email or password",
          },
        } as const;
      }

      console.log("Password comparison inputs:", {
        inputPwdLength: password?.length,
        storedPwdLength: user.password?.length,
      });

      const passwordMatch = await this.encrypt.compare(
        password,
        user.password as string
      );

      console.log("Password match result:", passwordMatch);

      if (!passwordMatch) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "Invalid email or password",
          },
        } as const;
      }

      // Authentication successful
      const token = this.createjwt.generateToken(user.id, user.role);
      const refreshToken = this.createjwt.generateRefreshToken(user.id);

      console.log("Token generated:", !!token);
      console.log("Refresh token generated:", !!refreshToken);

      return {
        status: OK,
        data: {
          success: true,
          message: "Authentication Successful!",
          data: returnUserData,
          userId: user.id,
          token: token,
          refresh_token: refreshToken,
        },
      } as const;
    } catch (error) {
      console.log("Login error in service:", error);
      throw error;
    }
  }

  async getUserByEmail(
    data: GetUserByEmail
  ): Promise<EmailExistCheckResponse | null> {
    try {
      const { email } = data;
      console.log("email from the userSercice ", email);
      return this.userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("error occured while getUserEmail in the userService");
      throw error;
    }
  }

  generateToken(data: GenerateTokenDTO, role: string): string | undefined {
    const { payload } = data;
    if (payload) return this.createjwt.generateToken(payload, role);
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
      const { id } = data;
      console.log("idddddddddddddddddddddd", id);
      if (!id)
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "User ID is missing",
          },
        } as const;
      const user = await this.userRepository.getUserById({ id: data.id });
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

  //getting all the services provided by the website
  async getServices(data: GetServicesDTO): Promise<GetServiceResponse | null> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const services = await this.userRepository.getAllServices({
        page,
        limit,
        searchQuery,
      });
      console.log("list of services is ", services);
      const servicesCount = await this.userRepository.getServiceCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { services, servicesCount },
        message: "success",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  //getting the user registered complaint details
  async getAllUserRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string,
    userId: string
  ): Promise<unknown> {
    try {
      const data = await this.userRepository.getAllUserRegisteredServices({
        page,
        limit,
        searchQuery,
        userId,
      });
      console.log("data in the userSErvice ", data);

      return data;
    } catch (error) {
      console.log(
        "Error occured while fetching the user registerd complaint in the userSercvice ",
        error as Error
      );
      throw error;
    }
  }

  //funtion to get mechanci details
  async getMechanicDetails(
    data: getMechanicDetailsDTO
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      console.log("Id in the mechService is ", id);
      const result = await this.userRepository.getMechanicDetails({ id });
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //function to getting the specified usercomplinat using id
  async getUserRegisteredServiceDetailsById(
    id: string
  ): Promise<getUserRegisteredServiceDetailsByIdResponse[]> {
    try {
      console.log("Enterdin the userService");
      const result =
        await this.userRepository.getUserRegisteredServiceDetailsById(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured while getting the specified userComplaint ",
        error as Error
      );
      throw error;
    }
  }

  async updateNewPassword(
    data: UpdateNewPasswordDTO
  ): Promise<UpdateNewPasswordResponse | null> {
    try {
      const { password, userId } = data;
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
      return await this.userRepository.updateNewPassword({
        password: newPassword,
        userId,
      });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async editUser(data: EditUserDTO): Promise<EditUserResponse | null> {
    try {
      const { _id, name, phone } = data;
      return this.userRepository.editUser({ _id, name, phone });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async AddUserAddress(
    data: AddUserAddressDTO
  ): Promise<AddUserAddressResponse | null> {
    try {
      const { _id, values } = data;
      console.log("id from the addUserAddress in the user service is ", _id);
      const address = await this.userRepository.addAddress({ _id, values });
      if (address) {
        return {
          _id: address._id,
          values: address as AddAddress,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while AddUserAddress in userService ");
    }
  }

  async editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      return await this.userRepository.editAddress({ _id, addressId, values });
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error while editAddress in userService ");
    }
  }

  async setUserDefaultAddress(
    data: SetUserDefaultAddressDTO
  ): Promise<SetUserDefaultAddressResponse | null> {
    try {
      const { userId, addressId } = data;
      console.log("entered in the userService ");
      return await this.userRepository.setDefaultAddress({ userId, addressId });
    } catch (error) {
      console.log(error as Error);
      throw new Error("error while setUserDefaultAddress in userService");
    }
  }

  async registerService(
    data: RegisterServiceDTO
  ): Promise<RegisterServiceResponse | null> {
    try {
      console.log("entered in the userService for register Service");
      return await this.userRepository.registerService(data);
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error while Registering user compliantes in userService"
      );
    }
  }
}

export default userService;
