import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ICreateJWT } from "../utils/generateToken";
import { compareInterface } from "../utils/comparePassword";
import Cryptr from "cryptr";
import {
  EmailExistResponse,
  IEmailExitCheck,
  getAllAcceptedServiceResponse,
  GetAllDevicesResponse,
  GetAllMechanicCompletedServicesResponse,
  GetAllMechanicResponse,
  IGetAllMechanics,
  GetAllUserRegisteredServicesResponse,
  getComplaintDetailsResponse,
  IGetMechanicDetails,
  getMechanicDetailsResponse,
  IGetPreSignedUrl,
  GetPreSignedUrlResponse,
  getUpdatedWorkAssingnedResponse,
  IAddMechAddress,
  IAddMechAddressResponse,
  ICreateRoomData,
  ICreateRoomResponse,
  IEditAddress,
  IEditAddressResponse,
  IResendOTPData,
  IupdateingMechanicDetailsResponse,
  IUpdateWorkDetails,
  IUpdatingMechanicDetails,
  IMechLogin,
  MechLoginResponse,
  MechRegistrationData,
  ISaveMech,
  SaveMechResponse,
  ISignUpMech,
  SignUpMechResponse,
  IUpdateNewPassword,
  UpdateNewPasswordResponse,
  IVerifyMechanic,
  verifyOTPResponse,
  INewDetails,
} from "../interfaces/dataContracts/Mech/IService.dto";
import { IMechServices } from "../interfaces/IServices/IMechServices";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";
import { ITempMech } from "../interfaces/Model/IMech";
import { LoginValidation, SignUpValidation } from "../utils/validator";
import { Iemail } from "../utils/email";
import { IRoomRepository } from "../interfaces/IRepository/IRoomRepository";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import { updateCompleteStatusResponse } from "../interfaces/dataContracts/Mech/IRepository.dto";


const { OK} = STATUS_CODES;
class mechService implements IMechServices {
  constructor(
    private _mechRepository: IMechRepository,
    private _concernRepository: IConcernRepository,
    private _roomRepository: IRoomRepository,
    private _createjwt: ICreateJWT,
    private _encrypt: compareInterface,
    private _email: Iemail
  ) {
    this._mechRepository = _mechRepository;
    this._concernRepository = _concernRepository;
    this._roomRepository = _roomRepository;
    this._createjwt = _createjwt;
    this._encrypt = _encrypt;
    this._email = _email;
  }

  async mechRegistration(
    mechData: MechRegistrationData
  ): Promise<Partial<ITempMech>> {
    try {
      const { email, name, phone, password, cpassword } = mechData;
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

      const mechExists = await this._mechRepository.emailExistCheck({ email });
      if (mechExists) {
        throw new Error("Email already exists");
      }

      const otp = await this._email.generateAndSendOTP(email);
      if (!otp) {
        throw new Error("Failed to generate OTP");
      }
      const tempMechDetails = { otp, mechData };
      const savedTempMech = await this._mechRepository.createTempMechData(
        tempMechDetails
      );
      return savedTempMech;
    } catch (error) {
      console.log(
        "Error occured in the mechRegistration in the mechService ",
        error
      );
      throw error;
    }
  }

  async verifyOTP(id: string, otp: string): Promise<verifyOTPResponse> {
    try {
      console.log(
        "enterd in the verify otp funciton in the mechServices ",
        id,
        otp
      );
      const getTempMechData = await this._mechRepository.getTempMechData(id);
      if (!getTempMechData) {
        return {
          success: false,
          message: "Temporary mechData is not found",
        };
      }

      const mechData = getTempMechData.mechData;
      console.log("mechData from the getTempMechData", mechData);
      const storedOtp = getTempMechData.otp;
      if (otp.toString() == storedOtp) {
        console.log("otp verified");
        if (mechData) {
          const { name, email, password, phone } = mechData;
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

          console.log("new Encryped password with data is ", newDetails);
          const mech = await this._mechRepository.saveMechanic(newDetails);
          if (mech && mech.role) {
            const mechId = mech.id?.toString();
            const access_token = this._createjwt.generateAccessToken(
              mechId as string,
              mech.role
            );
            const refresh_token = this._createjwt.generateRefreshToken(
              mechId as string
            );
            console.log("access token is", access_token);
            console.log("refreshtoken is", refresh_token);
            const newData = {
              name: mech.name,
              email: mech.email,
              _id: mech.id,
            };
            return {
              success: true,
              message: "Success",
              mechId: mechId,
              access_token: access_token,
              refresh_token: refresh_token,
              data: newData,
            };
          } else {
            return {
              success: false,
              message: "Mechanic creation faliled or role not defined",
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
      console.log(
        "Error occured in the verifyOTP function in the mechServie",
        error
      );
      throw error;
    }
  }


  //function to resnedOTP
   async resendOTP(data: IResendOTPData): Promise<Partial<ITempMech> | null> {
      try {
        const { tempMechId } = data;
        console.log("TempMechId isssssssss",tempMechId);
        const tempUserData = await this._mechRepository.getTempMechData(
          tempMechId
        );
        console.log("tempMechData in the resendOTP in the mechService",tempUserData);
        const userEmail = tempUserData?.mechData.email;
        const otp = await this._email.generateAndSendOTP(userEmail as string);
        if (!otp) {
          throw new Error("Failed to generate OTP");
        }
  
        const updatedTempUserData = await this._mechRepository.updateTempMechData({
          tempMechId,
          otp,
        });
        return updatedTempUserData;
      } catch (error) {
        console.log("Errror occured while resendOTP in the mechService", error);
        throw error;
      }
    }


  async signupMech(
    mechData: ISignUpMech
  ): Promise<SignUpMechResponse | null> {
    try {
      const { email } = mechData;
      return await this._mechRepository.emailExistCheck({ email });
    } catch (error) {
      console.log(
        "Error occured in the singup function in the mechService ",
        error
      );
      throw error;
    }
  }

  async saveMech(mechData: ISaveMech): Promise<SaveMechResponse> {
    try {
      console.log("Entered in mech Service and the mechData is ", mechData);
      const { name, email, password, phone } = mechData;
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
      const newDetails: ISaveMech = {
        name: name,
        password: newPassword,
        email: email,
        phone: phone,
        role: "mechanic",
      };
      console.log("new Encypted password with data is ", newDetails);
      const mech = await this._mechRepository.saveMechanic(newDetails);
      if (mech?.id) {
        const token = this._createjwt.generateAccessToken(mech.id, mech.role);
        const refresh_token = this._createjwt.generateRefreshToken(mech.id);

        return {
          status: OK,
          data: {
            success: true,
            message: "Success",
            mechId: mechData.id,
            token: token,
            data: mech,
            refresh_token,
          },
        };
      } else {
        return {
          status: STATUS_CODES.NOT_FOUND,
          data: {
            success: false,
            message:
              "failed to login (error from the saveMech in mech Services)",
          },
        };
      }
    } catch (error) {
      console.log("Error occured in the saveMech in the mechServie", error);
      throw error;
    }
  }

  
  async mechLogin(data: IMechLogin): Promise<MechLoginResponse> {
    try {
      console.log("entered in the mech login");
      const { email, password } = data;
      const check = LoginValidation(email, password);
      if (check) {
        const mech = await this._mechRepository.emailExistCheck({ email });
        console.log(
          "accessed mechanic details from the mechService, in the mechLogin function is ",
          mech
        );

        if (mech?._id) {
          if (mech.isBlocked) {
            console.log("Mechanic is blocked");
            return {
              status: STATUS_CODES.UNAUTHORIZED,
              data: {
                success: false,
                message: "You have been blocked by the admin!",
              },
            } as const;
          } else {
            if (mech.password && password) {
              const passwordMatch = await this._encrypt.compare(
                password,
                mech.password as string
              );

              if (passwordMatch) {
                console.log("password from the mech side is ", mech.password);
                const mechId = mech._id.toString();
                const token = this._createjwt.generateAccessToken(
                  mechId,
                  mech.role
                );
                const refreshToken =
                  this._createjwt.generateRefreshToken(mechId);
                console.log("mech is exist", mech);

                const filteredMech = {
                  id: mech._id.toString(),
                  name: mech.name,
                  email: mech.email,
                  role: mech.role,
                };

                return {
                  status: STATUS_CODES.OK || 200,
                  data: {
                    success: true,
                    message: "Authentication Successful !",
                    data: filteredMech,
                    mechId: mechId,
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
                    message: "Incorrect password!",
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
      console.log("Error occurred in the mechLogin in the mechService", error);
      throw error;
    }
  }


  async getUserByEmail(
    data: IEmailExitCheck
  ): Promise<EmailExistResponse | null> {
    try {
      const { email } = data;
      return this._mechRepository.emailExistCheck({ email });
    } catch (error) {
      console.log("Error occured in the getUserByEmail", error);
      throw error;
    }
  }

  async getAllMechanics(
    data: IGetAllMechanics
  ): Promise<GetAllMechanicResponse | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");
      const search = "";
      const mech = await this._mechRepository.getMechList({
        page,
        limit,
        searchQuery,
        search,
      });
      console.log("list of all mechanics is from the mechService is ", mech);
      const mechCount = await this._mechRepository.getMechCount(regex);
      return {
        status: STATUS_CODES.OK,
        data: { mech, mechCount },
        message: "success",
      };
    } catch (error) {
      console.log(
        "Error occured in the getAllmechanic in the mechServie",
        error
      );
      throw error;
    }
  }

  async VerifyMechanic(values: IVerifyMechanic) {
    try {
      console.log("Entered in the mechService for verifiying mechanic", values);
      const response = await this._mechRepository.verifyMechanic(values);
      return response;
    } catch (error) {
      console.log(
        "Error occured in the verifyMechanci in the mechServie",
        error
      );
      throw error;
    }
  }

  async getS3SingUrlForMechCredinential(
    data: IGetPreSignedUrl
  ): Promise<GetPreSignedUrlResponse> {
    try {
      const { fileName, fileType, name } = data;

      if (!fileName || !fileType) {
        return {
          success: false,
          message: "File name and type are required",
        } as GetPreSignedUrlResponse;
      }
      const folderName = `MechanicImages/MechanicCredential/${name}Credential`;
      const result = await generatePresignedUrl(fileName, fileType, folderName);
      return result as GetPreSignedUrlResponse;
    } catch (error) {
      console.log(
        "error occured in the getS3SignURlforMechCredinentaial in the mechServie",
        error
      );
      throw error;
    }
  }

  //update the compliant Status
  async updateComplaintStatus(
    complaintId: string,
    nextStatus: string
  ): Promise<updateCompleteStatusResponse | null> {
    try {
      console.log("Entered in the updateComplaintStatus");
      const result = await this._mechRepository.updateComplaintStatus(
        complaintId,
        nextStatus
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured in the mechService while updaing the complaint status",
        error
      );
      throw error;
    }
  }

  //getting all devices
  async getDevcies(): Promise<GetAllDevicesResponse[]> {
    try {
      const devices = await this._mechRepository.getAllDevices();
      console.log("list of device  is ", devices);
      return devices as GetAllDevicesResponse[];
    } catch (error) {
      console.log("Error occured at getDevice in the mechServie", error);
      throw error;
    }
  }

  async updateNewPassword(
    data: IUpdateNewPassword
  ): Promise<UpdateNewPasswordResponse | null> {
    try {
      const { password, mechId } = data;
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

      return await this._mechRepository.updateNewPassword({
        password: newPassword,
        mechId,
      });
    } catch (error) {
      console.log(
        "Error occured in the updatePassword in the mechService",
        error
      );
      throw error;
    }
  }

  async getMechanicDetails(
    data: IGetMechanicDetails
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      console.log("Id in the mechService is ", id);
      const result = await this._mechRepository.getMechanicDetails({ id });
      return result;
    } catch (error) {
      console.log(
        "Error occured in the getMechanicDetails in the mechService",
        error
      );
      throw error;
    }
  }

  async getAllUserRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const data = await this._concernRepository.getAllUserRegisteredServices({
        page,
        limit,
        searchQuery,
      });
      console.log("data in the mechService ", data);

      return data;
    } catch (error) {
      console.log(
        "Error occured while fetching the user registerd complaint in the mechService ",
        error
      );
      throw error;
    }
  }

  //function to getting the specified complinat using id
  async getComplaintDetails(
    id: string
  ): Promise<getComplaintDetailsResponse[] | null> {
    try {
      console.log("Enterdin the mechService");
      const result = await this._concernRepository.getComplaintDetails(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured while getting the specified Complaint by id in the mechServices  ",
        error
      );
      throw error;
    }
  }

  //function to update the complaint database while mechanic accetp the work
  async updateWorkAssigned(
    complaintId: string,
    mechanicId: string,
    status: string,
    roomId: string
  ): Promise<getUpdatedWorkAssingnedResponse> {
    try {
      console.log("Entered the mechservice");
      const result = await this._mechRepository.updateWorkAssigned(
        complaintId,
        mechanicId,
        status,
        roomId
      );
      return result;
    } catch (error) {
      console.log(
        "Error occued while updating the compliant database while mechanic accepting the work"
      );
      throw error;
    }
  }

  //function to get the all acccepted services by mechanic
  async getAllAcceptedServices(
    mechanicId: string
  ): Promise<getAllAcceptedServiceResponse[]> {
    try {
      console.log("Enterd in the mechService");
      const result = await this._mechRepository.getAllAcceptedServices(
        mechanicId
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured while getting the accepted complaint details in the mechService",
        error
      );
      throw error;
    }
  }

  //funciton to create room for chat
  async createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> {
    try {
      const { userId, mechId } = data;
      const result = await this._roomRepository.createRoom({ userId, mechId });
      return result;
    } catch (error) {
      console.log("Error occured in the createRoom in the MechService", error);
      throw error;
    }
  }

  //function to update the work details
  async updateWorkDetails(data: IUpdateWorkDetails): Promise<unknown> {
    try {
      const { complaintId, workDetails } = data;
      console.log(
        "complaintId and wrokDetails in the mechService is ",
        complaintId,
        workDetails
      );
      const result = await this._concernRepository.updateWorkDetails({
        complaintId,
        workDetails,
      });
      return result;
    } catch (error) {
      console.log(
        "error occured in the mechService while updating the work details while fixing  the complaint "
      );
      throw error;
    }
  }

  //function to getAllCompleted complaint by mechanic
  async getAllCompletedServices(
    mechanicId: string
  ): Promise<GetAllMechanicCompletedServicesResponse[] | null> {
    try {
      console.log(
        "Entered in the getAllCompliantService funtion in the mechService"
      );
      const result =
        await this._concernRepository.getAllCompletedServiceByMechanic(
          mechanicId
        );
      return result;
    } catch (error) {
      console.log(
        "error in getAllCompletedServices in the  mechService",
        error
      );
      throw error;
    }
  }

  //function to edit the mechanic profile
  async editMechanic(
    mechaicDetails: IUpdatingMechanicDetails
  ): Promise<IupdateingMechanicDetailsResponse | null> {
    try {
      const { mechId, values } = mechaicDetails;
      console.log(
        "Values reached in the mechService in the backend while eding the mechanic",
        mechaicDetails
      );
      const result = await this._mechRepository.editMechanic({ mechId, values });
      return result;
    } catch (error) {
      console.log("Erro occured in the editMechanic ", error);
      throw error;
    }
  }

  //function to add the address for the mechanic
  async AddMechAddress(
    data: IAddMechAddress
  ): Promise<IAddMechAddressResponse | null> {
    try {
      const { values } = data;
      const mechId = values.userId;
      // Ensure userId is optional before using delete
      delete (values as { userId?: string }).userId;
      const address = await this._mechRepository.addMechAddress({ mechId, values });
      if (address) {
        return address;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error in AddMechAddress in mechService", error);
      throw error;
    }
  }

  //editing the mechanic address
  async editAddress(data: IEditAddress): Promise<IEditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      return await this._mechRepository.editAddress({ _id, addressId, values });
    } catch (error) {
      console.log("error in ediAddress in the mechService ", error);
      throw error;
    }
  }

  
  async handleRemoveMechAddress(mechId: string,addressId:string): Promise<boolean> {
    try {
      console.log(
        "Enterd in the handleRemoveMechAddress in the mechService",
        mechId,addressId
      );
      const result = await this._mechRepository.handleRemoveMechAddress(
        mechId,addressId
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured in thehandleRemoveMechAddress function in mech service ",
        error
      );
      throw error;
    }
  }
}

export default mechService;
