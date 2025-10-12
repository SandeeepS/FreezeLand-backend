import { STATUS_CODES } from "../constants/httpStatusCodes";

import dotenv from "dotenv";
import Cryptr from "cryptr";
import {
  ISaveUser,
  SaveUserResponse,
  UserLoginResponse,
  EmailExistCheckResponse,
  GetProfileResponse,
  GetUserByEmail,
  GenerateRefreshToken,
  GetServiceResponse,
  AddUserAddressResponse,
  EditUserResponse,
  RegisterServiceResponse,
  UpdateNewPasswordResponse,
  EditAddressResponse,
  SetUserDefaultAddressResponse,
  getUserRegisteredServiceDetailsByIdResponse,
  verifyOTPResponse,
  GetServiceResponse2,
  IPaymentData,
  IupdateUserLocation,
  IupdateUserLocationResponse,
  IResendOTPData,
  GetPreSignedUrlResponse,
  IUserSignUp,
  IUserLogin,
  IGenerateToken,
  IGetProfile,
  IGetServices,
  IGetService,
  IUpdateNewPassword,
  IEditUser,
  // IAddUserAddress,
  IEditAddress,
  ISetUserDefaultAddress,
  IRegisterService,
  IGetPreSignedUrl,
  getMechanicDetailsResponse,
  IGetMechanicDetails,
  ISingUp,
  INewDetails,
  AddUserAddress,
  getAllAddressOfUserResponse,
} from "../interfaces/dataContracts/User/IService.dto";
import { IUserServices } from "../interfaces/IServices/IUserServices";
import { IUserRepository } from "../interfaces/IRepository/IUserRepository";
import { ICreateJWT } from "../utils/generateToken";
import { compareInterface } from "../utils/comparePassword";
import { LoginValidation, SignUpValidation } from "../utils/validator";
import { Iemail } from "../utils/email";
import { ITempUser } from "../interfaces/Model/IUser";
import { IServiceRepository } from "../interfaces/IRepository/IServiceRepository";
import { IOrderService } from "../interfaces/IServices/IOrderService";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import IOrderRepository from "../interfaces/IRepository/IOrderRepository";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import IAddressRepository from "../interfaces/IRepository/IAddressRepository";
dotenv.config();

const { OK, UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;
class userService implements IUserServices {
  constructor(
    private _userRepository: IUserRepository,
    private _addressReopository: IAddressRepository,
    private _serviceRepository: IServiceRepository,
    private _concernRepository: IConcernRepository,
    private _orderRepository: IOrderRepository,
    private _orderService: IOrderService,
    private _createjwt: ICreateJWT,
    private _encrypt: compareInterface,
    private _email: Iemail
  ) {
    this._userRepository = _userRepository;
    this._addressReopository = _addressReopository;
    this._serviceRepository = _serviceRepository;
    this._concernRepository = _concernRepository;
    this._orderRepository = _orderRepository;
    this._orderService = _orderService;
    this._createjwt = _createjwt;
    this._encrypt = _encrypt;
    this._email = _email;
  }

  //signup for user

  // UserService.ts
  async userRegister(userData: ISingUp): Promise<Partial<ITempUser> | null> {
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

      const userExists = await this._userRepository.emailExistCheck({ email });
      if (userExists) {
        throw new Error("Email already exists");
      }

      const otp = await this._email.generateAndSendOTP(email);
      if (!otp) {
        throw new Error("Failed to generate OTP");
      }

      const tempUserDetails = { otp, userData };
      const savedTempUser = await this._userRepository.createTempUserData(
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
      const tempUserData = await this._userRepository.getTempUserData(
        tempUserId
      );
      const userEmail = tempUserData?.userData.email;
      const otp = await this._email.generateAndSendOTP(userEmail as string);
      if (!otp) {
        throw new Error("Failed to generate OTP");
      }

      const updatedTempUserData = await this._userRepository.updateTempUserData(
        {
          tempUserId,
          otp,
        }
      );
      return updatedTempUserData;
    } catch (error) {
      console.log("Errror occured while resendOTP in the userService", error);
      throw error;
    }
  }

  //function to verify otp
  async verifyOTP(id: string, otp: string): Promise<verifyOTPResponse> {
    try {
      const getTempUserData = await this._userRepository.getTempUserData(id);
      if (!getTempUserData) {
        return {
          success: false,
          message: "Temporary user data not found",
        };
      }

      const userData = getTempUserData.userData;
      const storedOtp = getTempUserData.otp;

      if (otp.toString() === storedOtp) {
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
          const newDetails: INewDetails = {
            name: name as string,
            password: newPassword as string,
            email: email as string,
            phone: Number(phone),
          };

          const user = await this._userRepository.saveUser(newDetails);

          if (user && user.role) {
            const userId = user._id.toString();
            const token = this._createjwt.generateAccessToken(
              userId,
              user.role
            );
            const refresh_token = this._createjwt.generateRefreshToken(userId);
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
    userData: IUserSignUp
  ): Promise<EmailExistCheckResponse | null> {
    try {
      const { email } = userData;
      return await this._userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("Error occured in the isUserExist in the userService", error);
      throw error;
    }
  }

  async saveUser(userData: ISaveUser): Promise<SaveUserResponse> {
    try {
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
      const newDetails: INewDetails = {
        name: name,
        password: newPassword,
        email: email,
        phone: phone,
      };

      console.log("new Encypted password with data is ", newDetails);
      const user = await this._userRepository.saveUser({
        name,
        password,
        email,
        phone,
      });
      if (user && user?.role) {
        const userId = user._id.toString();
        const token = this._createjwt.generateAccessToken(userId, user.role);
        const refresh_token = this._createjwt.generateRefreshToken(userId);
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
      const result = await this._userRepository.getTempUserData(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured in the getTempUserData in the userService",
        error
      );
      throw error;
    }
  }

  async userLogin(data: IUserLogin): Promise<UserLoginResponse> {
    try {
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const user = await this._userRepository.emailExistCheck({ email });
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
              const passwordMatch = await this._encrypt.compare(
                password,
                user.password as string
              );

              if (passwordMatch) {
                const userId = user.id;
                const token = this._createjwt.generateAccessToken(
                  userId,
                  user.role
                );
                const refreshToken =
                  this._createjwt.generateRefreshToken(userId);
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
      const { email } = data;
      const user = await this._userRepository.emailExistCheck({ email });
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
          const token = this._createjwt.generateAccessToken(userId, user.role);
          const refreshToken = this._createjwt.generateRefreshToken(userId);

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
      return this._userRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("error occured while getUserEmail in the userService", error);
      throw error;
    }
  }

  //function to generateToken
  async generateToken(data: IGenerateToken, role: string): Promise<string> {
    const { payload } = data;

    if (!payload) {
      throw new Error("Payload is required for token generation");
    }

    try {
      const token = this._createjwt.generateAccessToken(payload, role);
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
      const refreshToken = this._createjwt.generateRefreshToken(payload);
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
      return await this._encrypt.hashPassword(password);
    } catch (error) {
      console.log("Error ocured in the haspassword in the userService", error);
      throw error;
    }
  }

  async getProfile(data: IGetProfile): Promise<GetProfileResponse> {
    try {
      const { id } = data;
      if (!id) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "User ID is missing",
          },
        } as const;
      }

      const user = await this._userRepository.getUserById({ id });
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
  async getServices(data: IGetServices): Promise<GetServiceResponse | null> {
    try {
      let { page, limit, searchQuery } = data;
      if (isNaN(page)) page = 1;
      if (isNaN(limit)) limit = 10;
      if (!searchQuery) searchQuery = "";
      const services = await this._userRepository.getAllServices({
        page,
        limit,
        searchQuery,
      });
      const servicesCount = await this._userRepository.getServiceCount({
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
      const data = await this._userRepository.getAllUserRegisteredServices({
        page,
        limit,
        searchQuery,
        userId,
      });
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
  async getService(data: IGetService): Promise<GetServiceResponse2 | null> {
    try {
      const { id } = data;
      const result = await this._serviceRepository.getService({ id });
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
    data: IGetMechanicDetails
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      const result = await this._userRepository.getMechanicDetails({ id });
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
      const result =
        await this._userRepository.getUserRegisteredServiceDetailsById(id);
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
    data: IUpdateNewPassword
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
      const result = await this._userRepository.updateNewPassword({
        password: newPassword,
        userId,
      });

      return result;
    } catch (error) {
      console.log(
        "Error occured in the updateNewPassword in the userService",
        error
      );
      throw error;
    }
  }

  async editUser(data: IEditUser): Promise<EditUserResponse | null> {
    try {
      const { _id, name, phone, profile_picture } = data;
      return this._userRepository.editUser({
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
    data: AddUserAddress
  ): Promise<AddUserAddressResponse | null> {
    try {
      console.log(data);
      const { values } = data;
      const address = await this._addressReopository.addAddress({ values });
      return address;
    } catch (error) {
      console.log("error occured AddUserAddress in the userService");
      throw error;
    }
  }

  async editAddress(data: IEditAddress): Promise<EditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      console.log(_id, addressId, values);
      // return await this._userRepository.editAddress({ _id, addressId, values });
      return null;
    } catch (error) {
      console.log("Error occured in the editAddress in the useService", error);
      throw error;
    }
  }

  async setUserDefaultAddress(
    data: ISetUserDefaultAddress
  ): Promise<SetUserDefaultAddressResponse | null> {
    try {
      const { userId, addressId } = data;
      return await this._addressReopository.setDefaultAddress({
        userId,
        addressId,
      });
    } catch (error) {
      console.log(
        "Error occured in the setUserDefaultAddress in the userService",
        error
      );
      throw error;
    }
  }

  async registerService(
    data: IRegisterService
  ): Promise<RegisterServiceResponse | null> {
    try {
      return await this._userRepository.registerService(data);
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
      const result = await this._orderService.createStripeSession(data);
      //herer need to check the session id is present in the current database
      const isPaymentExist = await this._orderRepository.checkPaymentExist(
        result.sessionId as string
      );
      if (isPaymentExist) {
        return {
          success: false,
          message: "payment is already exist , can't commit to payment ",
        };
      } else {
        return {
          success: true,
          message: "payment is not exist , can proceed with payment ",
          result,
        };
      }
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
      const result = await this._orderService.successPayment(data);

      if (result && result.status === "SUCCESS" && result.data) {
        const orderId = result.data._id?.toString();
        const complaintId = result.data.complaintId.toString();
        const updatedTheOrderDetailsInConcernDatabase =
          await this._concernRepository.updateConcernWithOrderId(
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

  async getPresignedUrl(
    data: IGetPreSignedUrl
  ): Promise<GetPreSignedUrlResponse> {
    try {
      const { fileName, fileType, folderName } = data;
      if (!fileName || !fileType) {
        return {
          success: false,
          message: "File name and type are required",
        } as GetPreSignedUrlResponse;
      }
      const result = await generatePresignedUrl(fileName, fileType, folderName);
      return result as GetPreSignedUrlResponse;
    } catch (error) {
      console.log("Error in the getPresignedUrl in the user Service", error);
      throw error;
    }
  }

  //function to update the location after singup
  async updateUserLocation(
    data: IupdateUserLocation
  ): Promise<IupdateUserLocationResponse | null> {
    try {
      const { userId, locationData } = data;
      const result = await this._userRepository.updateUserLocation({
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

  async handleRemoveUserAddress(
    userId: string,
    addressId: string
  ): Promise<boolean> {
    try {
      const result = await this._addressReopository.handleRemoveUserAddress(
        userId,
        addressId
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured in thehandleRemoveUserAddress function in user service ",
        error
      );
      throw error;
    }
  }

  async getAllAddressOfUser(
    userId: string
  ): Promise<getAllAddressOfUserResponse[] | null> {
    try {
      const result = await this._addressReopository.getAllAddressOfUser(userId);
      return result;
    } catch (error) {
      console.log(
        "error occured while accessing the user address from the userController ",
        error
      );
      throw error;
    }
  }
}

export default userService;
