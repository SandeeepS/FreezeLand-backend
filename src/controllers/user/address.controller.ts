import { Request, Response, NextFunction } from "express";
import { IAddressController } from "../../interfaces/IController/user/IAddressController";
import { IUserServices } from "../../interfaces/IServices/IUserServices";
import { AddressValidation } from "../../utils/validator";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
const { BAD_REQUEST, OK } = STATUS_CODES;

class AddressController implements IAddressController {
  constructor(private _userServices: IUserServices) {
    this._userServices = _userServices;
  }

  //this same funciton is also used for editing the existing user Address ,if the _id is present it is used to updated the existing address
  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "enterd in the addAddress fucniton in the backend userController",
      );
      const { newAddress } = req.body;
      console.log("new Address in the controller is ", newAddress);
      const check = AddressValidation(
        newAddress.userId,
        newAddress.addressType,
        newAddress.fullAddress,
        newAddress.houseNumber,
        newAddress.longitude,
        newAddress.latitude,
        newAddress.landmark,
      );
      if (check) {
        const addedAddress = await this._userServices.AddUserAddress({
          values: newAddress,
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
          "address validation failed form the addAddress in the userController",
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
        values.landMark,
      );
      if (check) {
        console.log("address validation done ");
        const editedAddress = await this._userServices.editAddress({
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
        "Enterd in the address funciton in the backend userController",
      );
      const { userId, addressId } = req.body;
      console.log("userId and addressId is ", userId, addressId);
      const updatedDefaultAddress =
        await this._userServices.setUserDefaultAddress({ userId, addressId });
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

   //funtion to remove the address
  async handleRemoveUserAddress(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userId, addressId } = req.body;
      console.log("address, id in the userController is", userId, addressId);
      const result = await this._userServices.handleRemoveUserAddress(
        userId as string,
        addressId as string,
      );
      if (result) {
        res.status(200).json({ success: true, result });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      console.log(
        "Error occured while handling the remove Address function in the userController",
        error,
      );
      next(error);
    }
  }

    //function to getAllUserAddress
  async getAllAddressOfUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      console.log(
        "Entered in the userController for accessing the userAddress with userId  ",
        userId,
      );
      const result = await this._userServices.getAllAddressOfUser(
        userId as string,
      );
      console.log("result from the controller is ", result);
      if (result) {
        res.status(200).json({ success: true, result });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      console.log(
        "Error occured while accessing userAddress in userController",
        error,
      );
      next(error);
    }
  }
}

export default AddressController;
