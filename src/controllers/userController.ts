import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3Client from "../awsConfig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { compareInterface } from "../utils/comparePassword";

const { BAD_REQUEST, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, NOT_FOUND } =
  STATUS_CODES;
import {
  AddressValidation,
  LoginValidation,
  SignUpValidation,
} from "../utils/validator";
import { EditUserDetailsValidator } from "../utils/validator";
import {
  EditUserDTO,
  ForgotResentOtpResponse,
  GetImageUrlResponse,
  SaveUserResponse,
} from "../interfaces/DTOs/User/IController.dto";
import { IUserController } from "../interfaces/IController/IUserController";
import { IUserServices } from "../interfaces/IServices/IUserServices";
import { ICreateJWT } from "../utils/generateToken";
import { Iemail } from "../utils/email";

class userController implements IUserController {
  constructor(
    private userServices: IUserServices,
    private encrypt: compareInterface,
    private createjwt: ICreateJWT,
    private email: Iemail
  ) {
    this.userServices = userServices;
    this.encrypt = encrypt;
    this.createjwt = createjwt;
    this.email = email;
  }
  milliseconds = (h: number, m: number, s: number) =>
    (h * 60 * 60 + m * 60 + s) * 1000;

  async userSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      req.app.locals.userData = req.body;
      console.log("userData is ilsgfhsdlgs", req.app.locals.userData);
      const { email, name, phone, password, cpassword } = req.body;
      console.log(
        "userDetials from the signup Form is",
        email,
        name,
        phone,
        password,
        cpassword
      );
      console.log(typeof phone);
      const check = SignUpValidation(name, phone, email, password, cpassword);
      if (check) {
        console.log("user details are validated from the backend and it is ok");
        const newUser = await this.userServices.isUserExist(
          req.app.locals.userData
        );
        if (!newUser) {
          req.app.locals.newUser = true;
          req.app.locals.userData = req.body;
          req.app.locals.userEmail = req.body.email;
          const otp = await this.email.generateAndSendOTP(req.body.email);
          req.app.locals.userOtp = otp;
          console.log("otp print ", req.app.locals.userOtp);

          const expirationMinutes = 1;
          setTimeout(() => {
            delete req.app.locals.userOtp;
          }, expirationMinutes * 60 * 1000);

          res.status(OK).json({
            userId: null,
            success: true,
            message: "OTP sent for verification...",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "The email is already in use!" });
        }
      } else {
        console.log("user details validation from the backend is failed");
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please enter  valid user  details !!",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async veryfyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { otp } = req.body;
      const isNuewUser = req.app.locals.newUser;
      const savedUser = req.app.locals.userData;

      const accessTokenMaxAge = 15 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      if (otp === Number(req.app.locals.userOtp)) {
        console.log(typeof otp);
        console.log(typeof req.app.locals.userOtp);
        if (isNuewUser) {
          const newUser = await this.userServices.saveUser(savedUser);
          req.app.locals = {};
          // const time = this.milliseconds(23, 30, 0);
          res
            .status(OK)
            .cookie("access_token", newUser?.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", newUser?.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(newUser);
        } else {
          res
            .status(OK)
            .cookie("access_token", isNuewUser.data.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", isNuewUser.data.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json({ success: true, message: "old user verified" });
        }
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Incorrect otp !" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async forgotResentOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ForgotResentOtpResponse | void> {
    try {
      const { email } = req.body;
      req.app.locals.userEmail = email;
      if (!email) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "please enter the email",
        }) as ForgotResentOtpResponse;
      }
      const user = await this.userServices.getUserByEmail(email);
      if (!user) {
        return res.status(BAD_REQUEST).json({
          success: false,
          message: "user with email is not exist!",
        }) as ForgotResentOtpResponse;
      }
      const otp = await this.email.generateAndSendOTP(email);
      req.app.locals.resendOtp = otp;

      const expirationMinutes = 1;
      setTimeout(() => {
        delete req.app.locals.resendOtp;
      }, expirationMinutes * 60 * 1000);

      res.status(OK).json({
        success: true,
        data: user,
        message: "OTP sent for verification...",
      } as ForgotResentOtpResponse);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async VerifyForgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const otp = req.body.otp;
      console.log("otp from the req body is ", otp);
      if (!otp)
        return res.json({ success: false, message: "Please enter the otp!" });
      if (!req.app.locals.resendOtp)
        return res.json({ success: false, message: "Otp is expired!" });
      if (otp === req.app.locals.resendOtp)
        res.json({ success: true, message: "both otp are same." });
      else res.json({ success: false, message: "Entered otp is not correct!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async userLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      // Add debug logging
      console.log("Login attempt for email:", email);

      // Validate input
      const isValid = LoginValidation(email, password);
      if (!isValid) {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please provide valid email and password",
        });
        return;
      }

      // Call service
      const loginStatus = await this.userServices.userLogin({
        email,
        password,
      });

      // Debug log full response structure
      console.log(
        "Login status in controller:",
        JSON.stringify(loginStatus, null, 2)
      );

      // Handle unsuccessful login without correct structure
      if (!loginStatus?.data || typeof loginStatus.data !== "object") {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Authentication error: Invalid response structure",
        });
        return;
      }

      // Check for successful login by checking success flag
      if (!loginStatus.data.success) {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: loginStatus.data.message || "Authentication failed",
        });
        return;
      }

      // Check for token in the data object
      if (!loginStatus.data.token) {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Authentication error: Token missing",
        });
        return;
      }

      // Successful login - set cookies and send response
      const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours

      res
        .status(loginStatus.status)
        .cookie("user_access_token", loginStatus.data.token, {
          maxAge: accessTokenMaxAge,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .cookie("user_refresh_token", loginStatus.data.refresh_token, {
          maxAge: refreshTokenMaxAge,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .json(loginStatus);
    } catch (error) {
      console.error("Login error:", error);
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An error occurred during login",
      });
      next(error); // Pass error to error handling middleware
    }
  }

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, email, googlePhotoUrl } = req.body;
    console.log("name and email from the google login", name, email);
    const accessTokenMaxAge = 5 * 60 * 1000;
    const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
    try {
      const user = await this.userServices.getUserByEmail({ email });
      if (user) {
        if (user.isBlocked) {
          res.status(UNAUTHORIZED).json({
            success: false,
            message: "user has been blocked by admin.",
          });
          // throw new Error('user has been blocked by admin...');
        } else {
          const token = this.userServices.generateToken(
            { payload: user.id },
            user.role
          );
          const refreshToken = this.userServices.generateRefreshToken({
            payload: user.id,
          });
          const data = {
            success: true,
            message: "Success",
            userId: user.id,
            token: token,
            refreshToken,
            data: user,
          };

          // const time = this.milliseconds(23, 30, 0);
          res
            .status(OK)
            .cookie("access_token", token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", refreshToken, {
              maxAge: refreshTokenMaxAge,
            })
            .json(data);
        }
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = await this.userServices.hashPassword(
          generatedPassword
        );

        const newUser: SaveUserResponse = await this.userServices.saveUser({
          name: name,
          email: email,
          password: hashedPassword,
          profile_picture: googlePhotoUrl,
        });
        if (newUser?.data) {
          // const time = this.milliseconds(23, 30, 0);
          res
            .status(OK)
            .cookie("access_token", newUser.token, {
              maxAge: accessTokenMaxAge,
            })
            .cookie("refresh_token", newUser.refresh_token, {
              maxAge: refreshTokenMaxAge,
            })
            .json(newUser.data);
        }
      }
    } catch (error) {
      next(error);
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error......" });
    }
  }

  //funciton to update New password
  async updateNewPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, userId } = req.body;
      const result = await this.userServices.updateNewPassword({
        password,
        userId,
      });
      console.log(result);
      if (result)
        res.json({ success: true, data: result, message: "successful" });
      else res.json({ success: false, message: "somthing went wrong!" });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (userId) {
        console.log("userId from the getProfile in the useController", userId);
        const currentUser = await this.userServices.getProfile({
          id: userId as string,
        });
        if (!currentUser)
          res
            .status(UNAUTHORIZED)
            .json({ success: false, message: "Authentication failed..!" });
        else if (currentUser?.data.data?.isBlocked)
          res.status(UNAUTHORIZED).json({
            success: false,
            message: "user has been blocked by the admin!",
          });
        else res.status(OK).json(currentUser);
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("req bidt kdjfsfdsffh", req.body);
      const { _id, name, phone }: EditUserDTO = req.body;
      const check = EditUserDetailsValidator(name, phone);
      if (check) {
        const editedUser = await this.userServices.editUser({
          _id,
          name,
          phone,
        });
        console.log("fghfgdfggdgnfgngnngjdfgnkj", editedUser);
        if (editedUser) {
          res
            .status(OK)
            .json({ success: true, message: "UserData updated sucessfully" });
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: "UserData updation is not updated !!",
          });
        }
      } else {
        res.status(UNAUTHORIZED).json({
          success: false,
          message: "Please check the name and phone number  !!",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "enterd in the addAddress fucniton in the backend userController"
      );
      const { values, _id } = req.body;
      console.log("id from the userController while adding address is", _id);
      const check = AddressValidation(
        values.name,
        values.phone,
        values.email,
        values.state,
        values.pin,
        values.district,
        values.landMark
      );
      if (check) {
        const addedAddress = await this.userServices.AddUserAddress({
          _id,
          values,
        });
        if (addedAddress) {
          res.status(OK).json({
            success: true,
            message: "User address added successfully",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "User Address addingh failed" });
        }
      } else {
        console.log(
          "address validation failed form the addAddress in the userController"
        );
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Address validation failed " });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async editAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in teh userController for editing the address");
      const { values, _id, addressId } = req.body;
      const check = AddressValidation(
        values.name,
        values.phone,
        values.email,
        values.state,
        values.pin,
        values.district,
        values.landMark
      );
      if (check) {
        console.log("address validation done ");
        const editedAddress = await this.userServices.editAddress({
          _id,
          addressId,
          values,
        });
        if (editedAddress) {
          res.status(OK).json({
            success: true,
            message: "Address edited  added successfully",
          });
        } else {
          res
            .status(BAD_REQUEST)
            .json({ success: false, message: "Address editing  failed" });
        }
      } else {
        console.log("address validation failed while editing the address");
        res.status(BAD_REQUEST).json({
          success: false,
          message: "address validation fialed while editing the address",
        });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "Enterd in the address funciton in the backend userController"
      );
      const { userId, addressId } = req.body;
      console.log("userId and addressId is ", userId, addressId);
      const updatedDefaultAddress =
        await this.userServices.setUserDefaultAddress({ userId, addressId });
      if (updatedDefaultAddress) {
        res.status(OK).json({
          success: true,
          message: "Default address updated successfully",
        });
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Default address updation failed" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async registerService(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "entered in the register service in the backend userController"
      );
      const { data } = req.body;
      console.log("data from the frontend is ", data);
      const result = await this.userServices.registerService(data);
      if (result) {
        res.status(OK).json({
          success: true,
          message: "Service  registered successfully",
        });
      } else {
        res
          .status(BAD_REQUEST)
          .json({ success: false, message: "Complaint registration failed" });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //getting all service which is provided by the website.
  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reached the getAllServices funciton in the user controller");
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      console.log(" page is ", page);
      console.log("limit is ", limit);
      const data = await this.userServices.getServices({
        page,
        limit,
        searchQuery,
      });
      console.log(
        "listed services from the database is in the admin controller is",
        data
      );
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //getting all the registered complaints from the user
  async getAllUserRegisteredServices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.query;
      console.log(
        "userId in the userController in the getAllUserRegisteredService",
        userId
      );

      const page = 1;
      const limit = 10;
      const searchQuery = "";
      const allRegisteredUserServices =
        await this.userServices.getAllUserRegisteredServices(
          page,
          limit,
          searchQuery,
          userId as string
        );
      if (allRegisteredUserServices) {
        res.status(OK).json({
          success: true,
          message: "data fetched successfully",
          allRegisteredUserServices: allRegisteredUserServices,
        });
      } else {
        res.status(NOT_FOUND).json({
          success: true,
          message: "Not Found",
        });
      }
    } catch (error) {
      console.log(
        "error while getting the allregistered complaints from the database in the userController",
        error as Error
      );
      next(error);
    }
  }

  async getImageUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetImageUrlResponse | void> {
    try {
      const { imageKey } = req.query;
      console.log("imageKey from the frontend is ", imageKey);
      if (typeof imageKey !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid image key",
        }) as GetImageUrlResponse;
      }

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey,
      });
      const url = await getSignedUrl(S3Client, command, { expiresIn: 3600 });
      res.status(200).json({ success: true, url });
    } catch (error) {
      next(error);
    }
  }

  //function to get the specified userComplaint using user Id
  async getUserRegisteredServiceDetailsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.query;
      console.log(
        "Enterd in the getUserRegisteredServiceDetailsById function in the userController with id",
        id
      );

      const result =
        await this.userServices.getUserRegisteredServiceDetailsById(
          id as string
        );
      res.status(200).json({ success: true, result });
    } catch (error) {
      next(error);
    }
  }

  //getting mechanic details  in the usercontroller.
  async getMechanicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "id reached in the userController for getting mech details",
        id
      );
      if (typeof id === "string") {
        const result = await this.userServices.getMechanicDetails({ id });
        res.status(OK).json({ success: true, result: result });
      } else {
        console.log(
          "Id is undifined in the getMechanicDetails in userController"
        );
        res.status(STATUS_CODES.CONFLICT).json({ success: false });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Entered in the function for logout");

      // Clear the access_token and refresh_token cookies
      res
        .clearCookie("user_access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Match the same settings as in login
          sameSite: "strict",
        })
        .clearCookie("user_refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Match the same settings as in login
          sameSite: "strict",
        });

      // Send a success response
      res
        .status(200)
        .json({ success: true, message: "User logged out successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default userController;
