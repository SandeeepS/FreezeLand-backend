import { STATUS_CODES } from "../constants/httpStatusCodes";
import { UserInterface } from "../models/userModel";
import UserRepository from "../repositories/userRepository";
import { CreateJWT } from "../utils/generateToken";
import Encrypt from "../utils/comparePassword";
import { comService } from "./comServices";


const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;
class userService implements comService<UserInterface> {
  constructor(
    private userRepository: UserRepository,
    private createjwt: CreateJWT,
    private encrypt: Encrypt
  ) {}
  async signupUser(userData: UserInterface): Promise<any> {
    try {
      console.log("Entered in user Service");
      const user = await this.userRepository.saveUser(userData);
      if (user) {
        console.log("user is registered ");
        return {
          status: OK,
          data: {
            success: true,
            message: "User is successfully registered ",
            data: user,
          },
        };
      } else {
        console.log("User is not registered");
      }
    } catch (error) {
      console.log(error as Error);
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
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: "Internal server Error!",
        },
      } as const;
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
}

export default userService;
