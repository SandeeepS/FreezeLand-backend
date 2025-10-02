import {
  IAddService,
  EmailExistResponse,
  EmailExitCheck,
  getAllAcceptedServiceResponse,
  GetAllDevicesResponse,
  getComplaintDetailsResponse,
  IGetMechanicDetails,
  getMechanicDetailsResponse,
  IGetMechById,
  GetMechByIdResponse,
  GetMechListResponse,
  getUpdatedWorkAssingnedResponse,
  IAddMechAddress,
  IAddMechAddressResponse,
  IEditAddress,
  IEditAddressResponse,
  IUpdatedMechnicDetails,
  IupdateingMechanicDetailsResponse,
  IUpdateMechanicDetails,
  IUpdateTempDataWithOTP,
  IUpdatingMechanicDetails,
  MechRegistrationData,
  ISaveMech,
  SaveMechResponse,
  updateCompleteStatusResponse,
  IUpdateNewPassword,
  UpdateNewPasswordResponse,
  IVerifyMechanic,
  IGetMechList,
  IGetMechanicAddress,
  IGetMechanicAddressResponse,
} from "../interfaces/dataContracts/Mech/IRepository.dto";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";
import { ITempMech, MechInterface } from "../interfaces/Model/IMech";
import concernModel from "../models/concernModel";
import MechModel, { TempMech } from "../models/mechModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import mongoose, { Document } from "mongoose";
import DeviceRepository from "./deviceRepository";
import serviceModel from "../models/serviceModel";

class MechRepository
  extends BaseRepository<MechInterface & Document>
  implements IMechRepository
{
  private _deviceRepository: DeviceRepository;

  constructor() {
    super(MechModel);
    this._deviceRepository = new DeviceRepository();
  }

  async createTempMechData(tempMechDetails: {
    otp: string;
    mechData: MechRegistrationData;
  }): Promise<ITempMech> {
    try {
      console.log(
        "enterd in the createTempMech funciton in the mechRepository"
      );
      const createdTempMech = new TempMech({
        otp: tempMechDetails.otp,
        mechData: tempMechDetails.mechData,
      });
      console.log("createdTempMech is = ", createdTempMech);
      const savedMech = await createdTempMech.save();
      return savedMech;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //function to get tempMech data
  async getTempMechData(id: string): Promise<ITempMech | null> {
    try {
      const result = await TempMech.findById(id);
      console.log("accessed the tempMechData in the mechRepository ", result);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async saveMechanic(mechData: ISaveMech): Promise<SaveMechResponse | null> {
    return this.save(mechData);
  }

  async emailExistCheck(
    data: EmailExitCheck
  ): Promise<EmailExistResponse | null> {
    try {
      const { email } = data;
      const mechFound = await this.findOne({ email });
      console.log("Mechanic found in the MechRepository:", mechFound);
      return mechFound;
    } catch (error) {
      console.log(
        "Error in MechRepository while checking email existence",
        error as Error
      );
      throw error;
    }
  }

  async updateNewPassword(
    data: IUpdateNewPassword
  ): Promise<UpdateNewPasswordResponse | null> {
    try {
      const { mechId, password } = data;
      const mech = await this.findById(mechId);
      if (mech) {
        mech.password = password;
        return await mech.save();
      }
      return null;
    } catch (error) {
      console.log(
        "Error in MechRepository while updating password",
        error as Error
      );
      throw error;
    }
  }

  async getMechById(data: IGetMechById): Promise<GetMechByIdResponse | null> {
    try {
      return this.findById(data.id);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured while getmechById");
    }
  }

  async getMechanicDetails(
    data: IGetMechanicDetails
  ): Promise<getMechanicDetailsResponse | null> {
    try {
      const { id } = data;
      const result = await this.findById(id);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error(
        "Error occured while getting mechanic Details in mechRepository"
      );
    }
  }

  //function to get the mechanic address
  async getMechanicAddress(
    data: IGetMechanicAddress
  ): Promise<IGetMechanicAddressResponse[] | null> {
    try {
      const { mechanicId } = data;
      console.log(
        "reached the mechController with id for accessing the mehchanic address",
        mechanicId
      );
      const mechanicObjectId = new mongoose.Types.ObjectId(mechanicId);
      const qr = { _id: mechanicObjectId };
      const result = await this.find(qr);
      if (result) {
        console.log(
          "result after fetching the mech Details ",
          result[0].address
        );
        return result[0].address;
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        "error while accessing the mechanic address in the mech repository ",
        error
      );
      throw error;
    }
  }

  async getMechList(data: IGetMechList): Promise<GetMechListResponse[]> {
    try {
      const { page, limit, search } = data;
      console.log("Search in the mechRepository", search);
      const regex = new RegExp(search.trim(), "i");
      const result = await MechModel.find({
        isDeleted: false,
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password")
        .exec();
      console.log("mech list is ", result);
      return result as MechInterface[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //getting the mechCount
  async getMechCount(regex: RegExp): Promise<number> {
    try {
      const result = await MechModel.countDocuments({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      });
      return result as number;
    } catch (error) {
      console.log(
        "error occured while getting the count in the userRepository",
        error
      );
      throw new Error();
    }
  }

  async AddService(data: IAddService): Promise<unknown> {
    try {
      const { values } = data;
      const newService = new serviceModel(values);
      await newService.save();
      return newService;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async verifyMechanic(values: IVerifyMechanic) {
    try {
      console.log("entered in the mechRepository");
      console.log("valeu sdfsdo dso", values);
      const id = values.id;
      console.log("id  ", id);
      const response = await this.update(id, values);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async getAllDevices(): Promise<GetAllDevicesResponse[] | null> {
    try {
      const result = await this._deviceRepository.getAllDevices2();
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //function to get the specified  complaint details  by id
  async getComplaintDetails(
    id: string
  ): Promise<getComplaintDetailsResponse[]> {
    try {
      console.log("id in the getUserRegisteredServiceDetailsById", id);
      const objectId = new mongoose.Types.ObjectId(id);

      // Use aggregation to get  registered specific user complaint with id  and  lookups
      const result = await concernModel.aggregate([
        {
          $match: {
            _id: objectId,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $addFields: {
            defaultAddressDetails: {
              $filter: {
                input: "$userDetails.address",
                as: "addr",
                cond: { $eq: ["$$addr._id", "$defaultAddress"] },
              },
            },
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },

        { $project: { "userDetails.password": 0 } },
      ]);
      console.log("User registered specific  service is :", result);
      return result as getComplaintDetailsResponse[];
    } catch (error) {
      console.log(
        "Error occured while fetching userDetails in the userRepository ",
        error as Error
      );
      throw new Error("Errorrrrr");
    }
  }

  async updateWorkAssigned(
    complaintId: string,
    mechanicId: string,
    status: string,
    roomId: string
  ): Promise<getUpdatedWorkAssingnedResponse> {
    try {
      console.log("Entered in the mechRepository");
      const mechanicIdObjectId = new mongoose.Types.ObjectId(mechanicId);

      // Update document fields and push a new entry to workHistory
      const updateData = {
        currentMechanicId: mechanicIdObjectId,
        status: status,
        $push: {
          workHistory: {
            mechanicId: mechanicIdObjectId,
            status: status,
            updatedAt: new Date(),
          },
        },
        chatId: roomId,
      };

      const result = await concernModel.findByIdAndUpdate(
        complaintId,
        updateData,
        { new: true }
      );

      return result as getUpdatedWorkAssingnedResponse;
    } catch (error) {
      console.log(
        "Error occurred while updating the complaint database while accessing the work by mechanic"
      );
      throw error;
    }
  }

  //find all accepted complaints by mechanic
  // find all accepted complaints by mechanic
  async getAllAcceptedServices(
    mechanicId: string
  ): Promise<getAllAcceptedServiceResponse[]> {
    try {
      console.log("entered in the mechRepository");
      const mechanicObjectId = new mongoose.Types.ObjectId(mechanicId);
      const result = await concernModel.aggregate([
        {
          $match: {
            currentMechanicId: mechanicObjectId,
            status: { $in: ["accepted", "pending", "onProcess"] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },

        {
          $addFields: {
            defaultAddressDetails: {
              $filter: {
                input: { $ifNull: ["$userDetails.address", []] },
                as: "addr",
                cond: {
                  $cond: {
                    if: { $isArray: "$defaultAddress" },
                    then: { $in: ["$$addr._id", "$defaultAddress"] },
                    else: { $eq: ["$$addr._id", "$defaultAddress"] },
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        {
          $project: {
            "userDetails.password": 0,
          },
        },
      ]);

      return result;
    } catch (error) {
      console.log(
        "error occurred while getting the accepted service from the database in the mechrepository"
      );
      throw error;
    }
  }

  //function to update the complaint status
  async updateComplaintStatus(
    complaintId: string,
    nextStatus: string
  ): Promise<updateCompleteStatusResponse | null> {
    try {
      console.log(
        "Entered in the updateCompaoint Stattus in the mechREpositroy",
        complaintId,
        nextStatus
      );
      const result = await concernModel.findByIdAndUpdate(complaintId, {
        status: nextStatus,
      });
      console.log("result after updating the status is ", result);
      return result;
    } catch (error) {
      console.log(
        "error occured during the updation of the status in the mechRepository ",
        error
      );
      throw new Error();
    }
  }

  //function to update the mechanic Details
  async editMechanic(
    mechaicDetails: IUpdatingMechanicDetails
  ): Promise<IupdateingMechanicDetailsResponse | null> {
    try {
      const { mechId, values } = mechaicDetails;
      console.log(
        "Values reached in the mechService in the backend while eding the mechanic",
        mechaicDetails
      );
      const phoneNumber = Number(values.phone);
      const qr = { name: values.name, phone: phoneNumber, photo: values.photo };
      const result = await this.update(mechId, qr);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //update Mechanic
  async updateMechanicEarnings(
    updateMechanicDetails: IUpdateMechanicDetails
  ): Promise<IUpdatedMechnicDetails | null> {
    try {
      const { mechanicId, mechanicEarning, dbSession } = updateMechanicDetails;
      console.log(
        "Mechanic Earning in the updateMechnicEearning ",
        mechanicEarning
      );

      const result = await MechModel.findByIdAndUpdate(
        mechanicId,
        { $inc: { wallet: mechanicEarning } },
        {
          session: dbSession,
          new: true,
        }
      );
      console.log(
        "wallet updated after adding mechanic earning in the updateMechanicEarning in the mechRepository",
        result
      );
      return result;
    } catch (error) {
      console.log(
        "error occured while updaing the mechanic earning in the mechRepository",
        error
      );
      throw error;
    }
  }

  //adding mechanic address
  async addMechAddress(
    data: IAddMechAddress
  ): Promise<IAddMechAddressResponse | null> {
    try {
      const { mechId, values } = data;
      console.log("new address from the mechRepository is ", values);
      const qr = { address: [values] };
      const addedAddress = await MechModel.findByIdAndUpdate(
        mechId,
        { $push: qr },
        { new: true }
      );
      console.log("added new mech address is ", addedAddress);
      return addedAddress;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //editing the mechanic address
  async editAddress(data: IEditAddress): Promise<IEditAddressResponse | null> {
    try {
      const { _id, addressId, values } = data;
      console.log(_id, addressId, values);
      // const editedAddress = await this.editExistAddress(_id, addressId, values);
      return null;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async updateTempMechData(
    data: IUpdateTempDataWithOTP
  ): Promise<ITempMech | null> {
    try {
      const { tempMechId, otp } = data;
      const result = await TempMech.findByIdAndUpdate(tempMechId, { otp: otp });
      console.log(
        "Updated tempMechData in the mechTempMechData in the mechRepository",
        result
      );
      return result;
    } catch (error) {
      console.log(
        "Error occured while udating the tempMechData while storing the new otp in the updateTempmechData , mechRepository",
        error
      );
      throw error;
    }
  }

  async handleRemoveMechAddress(
    mechId: string,
    addressId: string
  ): Promise<boolean> {
    try {
      const result = await MechModel.updateOne(
        { _id: mechId, "address._id": addressId },
        { $set: { "address.$.isDeleted": true } }
      );

      console.log("Result after updatin the address in the mechSide ", result);

      if (result.modifiedCount === 0) {
        throw new Error("No address found or already deleted.");
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Error occurred while removing user address in mechRepository"
      );
    }
  }
}

export default MechRepository;
