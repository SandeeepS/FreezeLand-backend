import { Request, Response, NextFunction } from "express";
import { IMechanicProfileController } from "../../interfaces/IController/mechanic/IMechanicProfileController";
import { IMechServices } from "../../interfaces/IServices/IMechServices";
import { STATUS_CODES } from "../../constants/httpStatusCodes";
import {
  AddressValidation,
  mechanicAddressValidation,
} from "../../utils/validator";
const { BAD_REQUEST, OK } = STATUS_CODES;

class MechanicProfileController implements IMechanicProfileController {
  constructor(private _mechServices: IMechServices) {
    this._mechServices = _mechServices;
  }

  //function to update the mechnanic profile
  async editMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechId, values } = req.body;
      console.log(
        "Entered in the mechController to update the mechanic profile details",
        mechId,
        values
      );
      const result = await this._mechServices.editMechanic({ mechId, values });
      res.status(OK).json({ success: true, result });
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //function to add address
  async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "enterd in the addAddress fucniton in the backend mechController"
      );
      const { newAddress } = req.body;
      console.log(newAddress.userId); // here the userId is refer to the mechanci id
      const check = mechanicAddressValidation(
        newAddress.userId,
        newAddress.fullAddress,
        newAddress.houseNumber,
        newAddress.longitude,
        newAddress.latitude,
        newAddress.landmark
      );
      if (check) {
        const addedAddress = await this._mechServices.AddMechAddress({
          values: newAddress,
        });
        if (addedAddress) {
          res.status(OK).json({
            success: true,
            message: "mechanic address added successfully",
          });
        } else {
          res.status(BAD_REQUEST).json({
            success: false,
            message: "Mechanic Address addingh failed",
          });
        }
      } else {
        console.log(
          "address validation failed form the addAddress in the mechController"
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

  //function to get the mechanic address
  async getMechanicAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechanicId } = req.query;
      console.log(
        "reached the mechController with id for accessing the mehchanic address",
        mechanicId
      );
      if (typeof mechanicId !== "string") {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Invalid mechanicId",
        });
        return;
      }
      const result = await this._mechServices.getMechanicAddress({
        mechanicId,
      });
      if (result) {
        res.status(OK).json({
          success: true,
          message: "Address fetched successfully",
          result,
        });
      } else {
        res.status(BAD_REQUEST).json({
          success: false,
          message: "Address fetching failed ",
        });
      }
    } catch (error) {
      console.log(
        "error while accessing the mechanic address in the mech controller ",
        error
      );
      next(error);
    }
  }

  //editing mechanic address
  async editAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("entered in teh mechanic Controller for editing the address");
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
        const editedAddress = await this._mechServices.editAddress({
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

  async verifyMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const { values } = req.body;
      console.log(
        "reached in the mechController for mech Verification ",
        values
      );
      const data = await this._mechServices.VerifyMechanic(values);
      res.status(OK).json(data);
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  async getMechanicDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query;
      console.log(
        "id reached in the mechController for getting mech details",
        id
      );
      if (typeof id === "string") {
        const result = await this._mechServices.getMechanicDetails({ id });
        console.log("result sdlfnsdfndsfdsf", result);
        res.status(OK).json({ success: true, result: result });
      } else {
        console.log(
          "Id is undifined in the getMechanicDetails in mechController"
        );
        res.status(STATUS_CODES.CONFLICT).json({ success: false });
      }
    } catch (error) {
      console.log(error as Error);
      next(error);
    }
  }

  //funtion to remove the address
  async handleRemoveMechAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { mechId, addressId } = req.body;
      const result = await this._mechServices.handleRemoveMechAddress(
        mechId as string,
        addressId as string
      );
      if (result) {
        res.status(200).json({ success: true, result });
      } else {
        res.status(200).json({ success: false });
      }
    } catch (error) {
      console.log(
        "Error occured while handling the remove Address function in the mechController",
        error
      );
      next(error);
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(
        "Enterd in the address funciton in the backend mechController"
      );
      const { mechId, addressId } = req.body;
      console.log("mechId and addressId is ", mechId, addressId);
      const updatedDefaultAddress =
        await this._mechServices.setUserDefaultAddress({ mechId, addressId });
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
}

export default MechanicProfileController;
