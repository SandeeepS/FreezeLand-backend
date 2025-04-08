import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ICreateJWT } from "../utils/generateToken";
import { compareInterface } from "../utils/comparePassword";
import Cryptr from "cryptr";
import {
  EmailExistResponse,
  EmailExitCheckDTO,
  GetAllDevicesResponse,
  GetAllMechanicResponse,
  GetAllMechanicsDTO,
  GetAllUserRegisteredServicesResponse,
  getComplaintDetailsResponse,
  getMechanicDetailsDTO,
  getMechanicDetailsResponse,
  GetPreSignedUrlDTO,
  GetPreSignedUrlResponse,
  MechLoginDTO,
  MechLoginResponse,
  SaveMechDTO,
  SaveMechResponse,
  SignUpMechDTO,
  SignUpMechResponse,
  UpdateNewPasswordDTO,
  UpdateNewPasswordResponse,
  VerifyMechanicDTO,
} from "../interfaces/DTOs/Mech/IService.dto";
import { IMechServices } from "../interfaces/IServices/IMechServices";
import { generatePresignedUrl } from "../utils/generatePresignedUrl";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";

const { OK, UNAUTHORIZED } = STATUS_CODES;
class mechService implements IMechServices {
  constructor(
    private mechRepository: IMechRepository,
    private createjwt: ICreateJWT,
    private encrypt: compareInterface
  ) {
    this.mechRepository = mechRepository;
    this.createjwt = createjwt;
    this.encrypt = encrypt;
  }

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

  async signupMech(
    mechData: SignUpMechDTO
  ): Promise<SignUpMechResponse | null> {
    try {
      const { email } = mechData;
      return await this.mechRepository.emailExistCheck({ email });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async saveMech(mechData: SaveMechDTO): Promise<SaveMechResponse> {
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
      const newDetails: SaveMechDTO = {
        name: name,
        password: newPassword,
        email: email,
        phone: phone,
        role: "mechanic",
      };
      console.log("new Encypted password with data is ", newDetails);
      const mech = await this.mechRepository.saveMechanic(newDetails);
      if (mech?.id) {
        const token = this.createjwt.generateToken(mech.id, mech.role);
        const refresh_token = this.createjwt.generateRefreshToken(mech.id);
        console.log("token is ", token);
        console.log("refresh", refresh_token);
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
      console.log(error as Error);
      throw error;
    }
  }

  async mechLogin(data: MechLoginDTO): Promise<MechLoginResponse> {
    try {
      const { email, password } = data;
      const mech = await this.mechRepository.emailExistCheck({ email });

      if (mech && mech.isBlocked) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: "You have been blocked by the mech !",
            data: mech,
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
          const mechId = mech._id.toString();

          const token = this.createjwt.generateToken(mechId, mech.role);
          const refreshToken = this.createjwt.generateRefreshToken(mechId);
          return {
            status: OK,
            data: {
              success: true,
              message: "Authentication Successful !",
              data: mech,
              mechId: mechId,
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
      } else {
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

  async getUserByEmail(
    data: EmailExitCheckDTO
  ): Promise<EmailExistResponse | null> {
    try {
      const { email } = data;
      return this.mechRepository.emailExistCheck({ email });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getAllMechanics(
    data: GetAllMechanicsDTO
  ): Promise<GetAllMechanicResponse | null> {
    try {
      const { page, limit, searchQuery } = data;
      const regex = new RegExp(searchQuery, "i");

      const mech = await this.mechRepository.getMechList({
        page,
        limit,
        searchQuery,
      });
      console.log("list of all mechanics is from the mechService is ", mech);
      const mechCount = await this.mechRepository.getMechCount(regex);
      return {
        status: STATUS_CODES.OK,
        data: { mech, mechCount },
        message: "success",
      };
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while getting registered mechanic in the mechService "
      );
    }
  }

  async VerifyMechanic(values: VerifyMechanicDTO) {
    try {
      console.log("Entered in the mechService for verifiying mechanic", values);
      const response = await this.mechRepository.verifyMechanic(values);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Erorr occured while vefirication fo the Mechanic from the mechService.tsx"
      );
    }
  }

  async getS3SingUrlForMechCredinential(data: GetPreSignedUrlDTO) {
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
      console.log(error);
      throw new Error(
        "error while generating the presinged url from the adminService"
      );
    }
  }

  //getting all devices
  async getDevcies(): Promise<GetAllDevicesResponse[]> {
    try {
      const devices = await this.mechRepository.getAllDevices();
      console.log("list of device  is ", devices);
      return devices as GetAllDevicesResponse[];
    } catch (error) {
      console.log(error);
      throw new Error("Error occured.");
    }
  }

  async updateNewPassword(
    data: UpdateNewPasswordDTO
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

      return await this.mechRepository.updateNewPassword({
        password: newPassword,
        mechId,
      });
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getMechanicDetails(
    data: getMechanicDetailsDTO
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      console.log("Id in the mechService is ", id);
      const result = await this.mechRepository.getMechanicDetails({ id });
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async getAllUserRegisteredServices(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const data = await this.mechRepository.getAllUserRegisteredServices({
        page,
        limit,
        searchQuery,
      });
      console.log("data in the mechService ", data);

      return data;
    } catch (error) {
      console.log(
        "Error occured while fetching the user registerd complaint in the mechService ",
        error as Error
      );
      throw error;
    }
  }

  //function to getting the specified complinat using id
  async getComplaintDetails(
    id: string
  ): Promise<getComplaintDetailsResponse[]> {
    try {
      console.log("Enterdin the mechService");
      const result = await this.mechRepository.getComplaintDetails(id);
      return result;
    } catch (error) {
      console.log(
        "Error occured while getting the specified Complaint by id in the mechServices  ",
        error as Error
      );
      throw error;
    }
  }
}

export default mechService;
