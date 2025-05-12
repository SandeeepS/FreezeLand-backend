import {
  AddServiceDTO,
  EmailExistResponse,
  EmailExitCheck,
  getAllAcceptedServiceResponse,
  GetAllDevicesResponse,
  GetAllUserRegisteredServicesDTO,
  GetAllUserRegisteredServicesResponse,
  getComplaintDetailsResponse,
  getMechanicDetailsDTO,
  getMechanicDetailsResponse,
  GetMechByIdDTO,
  GetMechByIdResponse,
  GetMechListDTO,
  GetMechListResponse,
  getUpdatedWorkAssingnedResponse,
  MechRegistrationData,
  SaveMechDTO,
  SaveMechResponse,
  updateCompleteStatusResponse,
  UpdateNewPasswordDTO,
  UpdateNewPasswordResponse,
  VerifyMechanicDTO,
} from "../interfaces/DTOs/Mech/IRepository.dto";
import { IMechRepository } from "../interfaces/IRepository/IMechRepository";
import { ITempMech, MechInterface } from "../interfaces/Model/IMech";
import concernModel from "../models/concernModel";
import deviceModel, { IDevice } from "../models/deviceModel";
import MechModel, {  TempMech } from "../models/mechModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import mongoose, { Document } from "mongoose";

class MechRepository
  extends BaseRepository<MechInterface & Document>
  implements IMechRepository
{
  private deviceRepository: BaseRepository<IDevice>;

  constructor() {
    super(MechModel);
    this.deviceRepository = new BaseRepository<IDevice>(deviceModel);
  }

  async createTempMechData(tempMechDetails: {
    otp: string;
    mechData: MechRegistrationData;
  }): Promise<ITempMech> {
    try {
      console.log("enterd in the createTempMech funciton in the mechRepository");
      const createdTempMech = new TempMech({
        otp: tempMechDetails.otp,
        mechData: tempMechDetails.mechData,
      });
      console.log("createdTempMech is = ",createdTempMech);
      const savedMech = await createdTempMech.save();
      return savedMech;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  //function to get tempMech data 
  async getTempMechData(id:string):Promise<ITempMech | null> {
    try{
      const result = await TempMech.findById(id);
      console.log("accessed the tempMechData in the mechRepository ",result);
      return result;
    }catch(error){
      console.log(error as Error);
      throw error;
    }
  }

  async saveMechanic(mechData: SaveMechDTO): Promise<SaveMechResponse | null> {
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
    data: UpdateNewPasswordDTO
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

  async getMechById(data: GetMechByIdDTO): Promise<GetMechByIdResponse | null> {
    try {
      return this.findById(data.id);
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured while getmechById");
    }
  }

  async getMechanicDetails(
    data: getMechanicDetailsDTO
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

  async getMechList(data: GetMechListDTO): Promise<GetMechListResponse[]> {
    try {
      const { page, limit, searchQuery, search } = data;
      console.log("Search in the mechRepository", search);
      const regex = new RegExp(search, "i");
      const result = await this.findAll(page, limit, regex);
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
      const result = await this.countDocument(regex);
      return result as number;
    } catch (error) {
      console.log(
        "error occured while getting the count in the userRepository",
        error
      );
      throw new Error();
    }
  }

  async AddService(data: AddServiceDTO): Promise<unknown> {
    try {
      const { values } = data;
      const result = await this.addService(values);
      return result;
    } catch (error) {
      console.log(error as Error);
      throw new Error();
    }
  }

  async verifyMechanic(values: VerifyMechanicDTO) {
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

  async getAllDevices(): Promise<GetAllDevicesResponse[]> {
    try {
      const result = await this.deviceRepository.findAll2();
      return result as GetAllDevicesResponse[];
    } catch (error) {
      console.log(error as Error);
      throw new Error("Error occured");
    }
  }

  //function for getting all the userRegistered services
  async getAllUserRegisteredServices(
    data: GetAllUserRegisteredServicesDTO
  ): Promise<GetAllUserRegisteredServicesResponse[] | null> {
    try {
      const { page, limit } = data;

      // Use aggregation to get user's registered services with lookups
      const result = await concernModel.aggregate([
        {
          $match: {
            isDeleted: false,
            $or: [
              { currentMechanicId: { $exists: false } },
              { currentMechanicId: null },
            ],
          },
        },
        {
          $lookup: {
            from: "users", // The users collection
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "services", // The services collection
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { "userDetails.password": 0 } }, // Exclude password
      ]);

      console.log("User registered services:", result);
      return result as GetAllUserRegisteredServicesResponse[];
    } catch (error) {
      console.log(
        "Error occurred while fetching user registered services:",
        error as Error
      );
      throw new Error(
        "Error occurred while fetching user registered services."
      );
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
    roomId:string,
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
        chatId:roomId
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
}

export default MechRepository;
