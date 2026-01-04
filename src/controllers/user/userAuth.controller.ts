import { IUserAuthController } from "../../interfaces/IController/user/IUserAuthController";
import { IUserServices } from "../../interfaces/IServices/IUserServices";

class UserAuthController implements IUserAuthController {
  constructor(private _userService: IUserServices) {
    this._userService = _userService;
  }

      

}

export default UserAuthController;

