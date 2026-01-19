import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { OK, UNAUTHORIZED, BAD_REQUEST } = STATUS_CODES;
import { IProfileController } from "../../interfaces/IController/user/IProfile.controller";
import { IUserServices } from "../../interfaces/IServices/IUserServices";
import { Iemail } from "../../utils/email";
import { IEditUser } from "../../interfaces/dataContracts/User/IController.dto";
import { EditUserDetailsValidator } from "../../utils/validator";

class ProfileController implements IProfileController {
  constructor(
    private _userServices: IUserServices,
    private _email: Iemail,
  ) {
    this._userServices = _userServices;
    this._email = _email;
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      if (userId) {
        console.log("userId from the getProfile in the useController", userId);
        const currentUser = await this._userServices.getProfile({
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
      const { _id, name, phone, profile_picture }: IEditUser = req.body;
      const check = EditUserDetailsValidator(name, phone);
      if (check) {
        const editedUser = await this._userServices.editUser({
          _id,
          name,
          phone,
          profile_picture,
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
}

export default ProfileController;
