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
  SingUpDTO,
  verifyOTPResponse,
  GetServiceDTO,
  GetServiceResponse2,
  IPaymentData,
  IupdateUserLocation,
  IupdateUserLocationResponse,
  IResendOTPData,
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
import { LoginValidation, SignUpValidation } from "../utils/validator";
import { Iemail } from "../utils/email";
import { ITempUser } from "../interfaces/Model/IUser";
import { IServiceRepository } from "../interfaces/IRepository/IServiceRepository";
import { IOrderService } from "../interfaces/IServices/IOrderService";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IOrderRepository from "../interfaces/IRepository/IOrderRepository";
dotenv.config();

const { OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
class userService implements IUserServices {
  constructor(
    private userRepository: IUserRepository,
    private serviceRepository: IServiceRepository,
    private concernRepository: IConcernRepository,
    private orderRepository: IOrderRepository,
    private orderService: IOrderService,
    private createjwt: ICreateJWT,
    private encrypt: compareInterface,
    private email: Iemail
  ) {
    this.userRepository = userRepository;
    this.serviceRepository = serviceRepository;
    this.concernRepository = concernRepository;
    this.orderRepository = orderRepository;
    this.orderService = orderService;
    this.createjwt = createjwt;
    this.encrypt = encrypt;
    this.email = email;
  }

  //signup for user

  // UserService.ts
  async userRegister(userData: SingUpDTO): Promise<Partial<ITempUser> | null> {
    try {
      const { email, name, phone, password, cpassword } = userData;
      const isValid = SignUpValidation(
        name,
        phone.toString(),
        email,
        password,
        cpassword
      );

      if (!isValid) {
        throw new Error("Invalid user data");
      }

      const userExists = await this.userRepository.emailExistCheck({ email });
      if (userExists) {
        throw new Error("Email already exists");
      }

      const otp = await this.email.generateAndSendOTP(email);
      if (!otp) {
        throw new Error("Failed to generate OTP");
      }

      const tempUserDetails = { otp, userData };
      const savedTempUser = await this.userRepository.createTempUserData(
        tempUserDetails
      );

      return savedTempUser;
    } catch (error) {
      console.log("Error in userRegister in the userService", error);
      throw error;
    }
  }

  async resendOTP(data: IResendOTPData): Promise<Partial<ITempUser> | null> {
    try {
      const { tempUserId } = data;
      console.log("TempUserId isssssssss", tempUserId);
      const tempUserData = await this.userRepository.getTempUserData(
        tempUserId
      );
      console.log(
        "tempUserData in the resendOTP in the userService",
        tempUserData
      );
      const userEmail = tempUserData?.userData.email;
      const otp = await this.email.generateAndSendOTP(userEmail as string);
      if (!otp) {
        throw new Error("Failed to generate OTP");
      }

      const updatedTempUserData = await this.userRepository.updateTempUserData({
        tempUserId,
        otp,
      });
      return updatedTempUserData;
    } catch (error) {
      console.log("Errror occured while resendOTP in the userService", error);
      throw error;
    }
  }

  //function to verify otp
  async verifyOTP(id: string, otp: string): Promise<verifyOTPResponse> {
    try {
      console.log(
        "Entered in the verifyOpt function in the userService",
        id,
        otp
      );
      const getTempUserData = await this.userRepository.getTempUserData(id);

      if (!getTempUserData) {
        return {
          success: false,
          message: "Temporary user data not found",
        };
      }

      const userData = getTempUserData.userData;
      console.log("userData from the getTemuserData", userData);
      const storedOtp = getTempUserData.otp;

      if (otp.toString() === storedOtp) {
        console.log("otp verified");
        if (userData) {
          const { name, email, password, phone } = userData;
          const secret_key: string | undefined = process.env.CRYPTR_SECRET;
          if (!secret_key) {
            throw new Error(
              "Encryption secret key is not defined in the environment"
            );
          }

          const cryptr = new Cryptr(secret_key, {
            encoding: "base64",
            pbkdf2Iterations: 10000,
            saltLength: 10,
          });

          const newPassword = cryptr.encrypt(password as string);
          const newDetails: NewDetailsDTO = {
            name: name as string,
            password: newPassword as string,
            email: email as string,
            phone: Number(phone),
          };

          console.log("new Encrypted password with data is ", newDetails);
          const user = await this.userRepository.saveUser(newDetails);

          if (user && user.role) {
            const userId = user._id.toString();
            const token = this.createjwt.generateAccessToken(userId, user.role);
            const refresh_token = this.createjwt.generateRefreshToken(userId);
            console.log("token is ", token);
            console.log("refresh", refresh_token);
            const newData = {
              name: user.name,
              email: user.email,
              id: user._id,
            };
            return {
              success: true,
              message: "Success",
              userId: userId,
              token: token,
              data: newData,
              refresh_token,
            };
          } else {
            return {
              success: false,
              message: "User creation failed or role not defined",
            };
          }
        } else {
          return {
            success: false,
            message: "User data not found",
          };
        }
      } else {
        console.log("otp is not verified");
        return {
          success: false,
          message: "Invalid OTP",
        };
      }
    } catch (error) {
      console.log("Error in verify OTP", error);
      throw error;
    }
  }

  async isUserExist(
    userData: UserSignUpDTO
  ): Promise<EmailExistCheckResponse | null> {
    try {
      const { email } = userData;
      return await this.userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("Error occured in the isUserExist in the userService", error);
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
      const user = await this.userRepository.saveUser({
        name,
        password,
        email,
        phone,
      });
      if (user && user?.role) {
        const userId = user._id.toString();
        const token = this.createjwt.generateAccessToken(userId, user.role);
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
      console.log("Error occured in the saveUser in the userService", error);
      throw error;
    }
  }

  //getting the tempUser details from the database for otp verification
  async getTempUserData(id: string): Promise<ITempUser | null> {
    try {
      const result = await this.userRepository.getTempUserData(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured in the getTempUserData in the userService",
        error
      );
      throw error;
    }
  }

  async userLogin(data: UserLoginDTO): Promise<UserLoginResponse> {
    try {
      console.log("entered in the user login");
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const user = await this.userRepository.emailExistCheck({ email });
        console.log(
          "accessed user details from the userService, in the userLogin function is ",
          user
        );

        if (user?.id) {
          if (user.isBlocked) {
            console.log("User is blocked");
            return {
              status: STATUS_CODES.UNAUTHORIZED,
              data: {
                success: false,
                message: "Your account has been blocked by the admin",
              },
            } as const;
          } else {
            if (user.password && password) {
              const passwordMatch = await this.encrypt.compare(
                password,
                user.password as string
              );

              if (passwordMatch) {
                console.log("password from the user side is ", user.password);
                const userId = user.id;
                const token = this.createjwt.generateAccessToken(
                  userId,
                  user.role
                );
                const refreshToken =
                  this.createjwt.generateRefreshToken(userId);
                console.log("user is exist", user);

                const filteredUser = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };

                return {
                  status: STATUS_CODES.OK || 200,
                  data: {
                    success: true,
                    message: "Authentication Successful !",
                    data: filteredUser,
                    userId: userId,
                    token: token,
                    refresh_token: refreshToken,
                  },
                };
              } else {
                console.log("Incorrect password");
                return {
                  status: STATUS_CODES.UNAUTHORIZED,
                  data: {
                    success: false,
                    message: "Incorrted password",
                  },
                } as const;
              }
            } else {
              console.log("Email or password is missing");
              return {
                status: STATUS_CODES.UNAUTHORIZED,
                data: {
                  success: false,
                  message: "Email or password is missing",
                },
              } as const;
            }
          }
        } else {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            data: {
              success: false,
              message: "Email not exist",
            },
          } as const;
        }
      } else {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          data: {
            success: false,
            message: "Email or password is incorrect",
          },
        } as const;
      }
    } catch (error) {
      console.log("Error occurred in the userLogin in the userService", error);
      throw error;
    }
  }

  async googleLogin(data: {
    name: string;
    email: string;
    googlePhotoUrl: string;
  }): Promise<UserLoginResponse> {
    try {
      console.log("entered in the google login service");
      const { email } = data;

      const user = await this.userRepository.emailExistCheck({ email });

      if (user?.id) {
        // Existing user login
        if (user.isBlocked) {
          console.log("User is blocked");
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            data: {
              success: false,
              message: "Your account has been blocked by the admin",
            },
          } as const;
        } else {
          console.log("Existing Google user found", user);
          const userId = user.id;
          const token = this.createjwt.generateAccessToken(userId, user.role);
          const refreshToken = this.createjwt.generateRefreshToken(userId);

          const filteredUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };

          return {
            status: STATUS_CODES.OK || 200,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: filteredUser,
              userId: userId,
              token: token,
              refresh_token: refreshToken,
            },
          };
        }
      } else {
        // Email not found - user needs to signup first
        console.log("Email not found for Google login");
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          data: {
            success: false,
            message: "Email not found. Please proceed with signup first.",
          },
        } as const;
      }
    } catch (error) {
      console.log(
        "Error occurred in the googleLogin in the userService",
        error
      );
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
      console.log("error occured while getUserEmail in the userService", error);
      throw error;
    }
  }

  //function to generateToken
  async generateToken(data: GenerateTokenDTO, role: string): Promise<string> {
    const { payload } = data;

    if (!payload) {
      throw new Error("Payload is required for token generation");
    }

    try {
      const token = this.createjwt.generateAccessToken(payload, role);
      if (!token) {
        throw new Error("Failed to generate JWT token");
      }
      return token;
    } catch (error) {
      console.log("Error generating token in the userService ", error);
      throw error;
    }
  }

  async generateRefreshToken(data: GenerateRefreshToken): Promise<string> {
    const { payload } = data;

    if (!payload) {
      throw new Error("Payload is required for refresh token generation");
    }

    try {
      const refreshToken = this.createjwt.generateRefreshToken(payload);
      if (!refreshToken) {
        throw new Error("Failed to generate refresh token");
      }
      return refreshToken;
    } catch (error) {
      console.log("Error generating refresh token in the userService", error);
      throw error;
    }
  }

  async hashPassword(password: string) {
    try {
      return await this.encrypt.hashPassword(password);
    } catch (error) {
      console.log("Error ocured in the haspassword in the userService", error);
      throw error;
    }
  }

  async getProfile(data: GetProfileDTO): Promise<GetProfileResponse> {
    try {
      const { id } = data;
      console.log("idddddddddddddddddddddd", id);
      if (!id) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "User ID is missing",
          },
        } as const;
      }

      const user = await this.userRepository.getUserById({ id });
      console.log("User detail in the userService from the getUserByid", user);
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
      console.log("Error occured in the getProfile in userService", error);
      throw error;
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
      const servicesCount = await this.userRepository.getServiceCount({
        searchQuery,
      });

      return {
        status: STATUS_CODES.OK,
        data: { services, servicesCount },
        message: "success",
      };
    } catch (error) {
      console.log("Error occured in the getService in the useService", error);
      throw error;
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
        error
      );
      throw error;
    }
  }

  //getting the service Deatils from the service repositroy
  async getService(data: GetServiceDTO): Promise<GetServiceResponse2 | null> {
    try {
      const { id } = data;
      console.log("reached the getService in the userService");
      const result = await this.serviceRepository.getService({ id });
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error while getService in the userService", error);
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
      console.log("Error in getMechanicDetails ", error);
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
        error
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
      console.log(
        "Error occured in the updateNewPassword in the userService",
        error
      );
      throw error;
    }
  }

  async editUser(data: EditUserDTO): Promise<EditUserResponse | null> {
    try {
      const { _id, name, phone, profile_picture } = data;
      return this.userRepository.editUser({
        _id,
        name,
        phone,
        profile_picture,
      });
    } catch (error) {
      console.log("Error occured in the editUser", error);
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
      console.log("error occured AddUserAddress in the userService");
      throw error;
    }
  }

  async editAddress(data: EditAddressDTO): Promise<EditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      return await this.userRepository.editAddress({ _id, addressId, values });
    } catch (error) {
      console.log("Error occured in the editAddress in the useService", error);
      throw error;
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
      console.log(
        "Error occured in the setUserDefaultAddress in the userService",
        error
      );
      throw error;
    }
  }

  async registerService(
    data: RegisterServiceDTO
  ): Promise<RegisterServiceResponse | null> {
    try {
      console.log("entered in the userService for register Service");
      return await this.userRepository.registerService(data);
    } catch (error) {
      console.log(
        "Error occured in the registerService in the userService",
        error
      );
      throw error;
    }
  }

  //funciton to create stripe session
  async createStripeSession(data: IPaymentData): Promise<unknown> {
    try {
      const result = await this.orderService.createStripeSession(data);
      console.log(
        "result in the userService for creating stripe session",
        result
      );
      return result;
    } catch (error) {
      console.log(
        "error occured while creating the stripe session in the userService",
        error
      );
      throw error;
    }
  }
  async successPayment(data: string): Promise<unknown> {
    try {
      console.log("entered in the successPayment user service in the backend");
      const result = await this.orderService.successPayment(data);
      console.log("result in the userService for success payment", result);
      console.log("want to update the concern model about the payment");

      if (result && result.status === "SUCCESS" && result.data) {
        const orderId = result.data._id?.toString();
        // FIX: Change this line - remove .response
        const complaintId = result.data.complaintId.toString();

        console.log("Extracted complaintId:", complaintId);
        console.log("Extracted orderId:", orderId);

        const updatedTheOrderDetailsInConcernDatabase =
          await this.concernRepository.updateConcernWithOrderId(
            complaintId,
            orderId as string
          );
        console.log(
          "updated concern details after payment in the userService is ",
          updatedTheOrderDetailsInConcernDatabase
        );
        return result;
      } else {
        return {
          success: false,
          response: null,
        };
      }
    } catch (error) {
      console.log(
        "error occurred while creating the stripe session in the userService",
        error
      );
      throw error;
    }
  }

  //function to update the location after singup
  async updateUserLocation(
    data: IupdateUserLocation
  ): Promise<IupdateUserLocationResponse | null> {
    try {
      const { userId, locationData } = data;
      console.log(
        "Enterd in the updateUserLocation in the userService",
        locationData
      );
      const result = await this.userRepository.updateUserLocation({
        userId,
        locationData,
      });
      return result;
    } catch (error) {
      console.log(
        "Error occured in the updateUserLocation function in user service ",
        error
      );
      throw error;
    }
  }
}

export default userService;
