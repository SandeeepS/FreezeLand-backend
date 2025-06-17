import mongoose, { Model } from "mongoose";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import concernModel, { Iconcern } from "../models/concernModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import {
  GetAllMechanicCompletedServicesResponse,
  IGetAllUserRegisteredServices,
  GetAllUserRegisteredServicesResponse,
  getComplaintDetailsResponse,
  IAllComplaintDataResponse,
  IUpdateWorkDetails,
  UpdatedcomplaintWithOrderIdResponse,
} from "../interfaces/DTOs/Concern/IRepository";

class ConcernRepository
  extends BaseRepository<Iconcern & Document>
  implements IConcernRepository
{
  constructor() {
    super(concernModel as unknown as Model<Iconcern & Document>);
  }

  //function to update the work details by admin
  async updateWorkDetails(data: IUpdateWorkDetails): Promise<unknown> {
    try {
      const { complaintId, workDetails } = data;
      const result = await concernModel.findByIdAndUpdate(
        complaintId,
        { $push: { workDetails: { $each: workDetails } } },
        { new: true }
      );

      console.log("result after updation:", result);
      return result;
    } catch (error) {
      console.log("errror occured in the concernRepository ",error);
      throw new Error("error occured while udating the worker Details");
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
         {
          $lookup: {
            from: "orders",
            localField: "orderId",
            foreignField: "_id",
            as: "orderDetails",
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

  //function to get all complaints
  async getAllComplaints(
    page: number,
    limit: number,
    searchQuery: string,
    search: string
  ): Promise<IAllComplaintDataResponse[] | null> {
    try {
      console.log(
        "entered in the get all complaints method in the concern repository"
      );
      console.log("search in the order repository", search);
      const regex = new RegExp(search, "i");
      const result = await this.findAll(page, limit, regex);
      console.log("all complaint list is  in the concern Repository", result);
      return result;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

  //funciton to cancel complaints
  // In your concernRepository
  async cancelComplaint(
    complaintId: string,
    userRole: string,
    reason: string
  ): Promise<unknown> {
    try {
      console.log("Entered cancelComplaint in concernRepository");

      const complaint = await concernModel.findById(complaintId);
      const mechanicId = complaint?.currentMechanicId;
      if (!complaint) {
        throw new Error("Complaint not found");
      }

      const now = new Date();

      if (userRole === "user") {
        complaint.status = "cancelled";
        complaint.userCancellation = {
          canceledAt: now,
          reason,
        };

        // Update the most recent work history item, if any
        if (complaint.workHistory.length > 0) {
          const lastEntry =
            complaint.workHistory[complaint.workHistory.length - 1];
          if (lastEntry.status !== "completed") {
            lastEntry.status = "cancelled";
            lastEntry.acceptedAt = lastEntry.acceptedAt || now;
            lastEntry.canceledAt = now;
            lastEntry.reason = reason;
            lastEntry.canceledBy = "user";
          }
        }
      } else if (userRole === "mechanic") {
        if (!mechanicId) throw new Error("Mechanic ID required");

        complaint.status = "pending";
        complaint.needsReassignment = true;
        complaint.currentMechanicId = null;

        // Updating the most recent work history item by the same mechanic
        const lastEntry = [...complaint.workHistory]
          .reverse()
          .find(
            (entry) => entry.mechanicId.toString() === mechanicId.toString()
          );

        if (lastEntry) {
          lastEntry.status = "cancelled";
          lastEntry.canceledAt = now;
          lastEntry.reason = reason;
          lastEntry.canceledBy = "mechanic";
        } else {
          // If no workHistory exists, add a new one
          complaint.workHistory.push({
            mechanicId: new mongoose.Types.ObjectId(mechanicId),
            status: "cancelled",
            acceptedAt: now,
            canceledAt: now,
            reason,
            canceledBy: "mechanic",
          });
        }
      } else {
        throw new Error("Invalid user role");
      }

      const updatedComplaint = await complaint.save();
      return updatedComplaint;
    } catch (error) {
      console.error("Error occurred while cancelling complaint:", error);
      throw error;
    }
  }

  //function for getting all the userRegistered services
  async getAllUserRegisteredServices(
    data: IGetAllUserRegisteredServices
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
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
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
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { "userDetails.password": 0 } },
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

  //function for getting all the mechanic's completed service history
  async getAllCompletedServiceByMechanic(
    mechanicId: string
  ): Promise<GetAllMechanicCompletedServicesResponse[] | null> {
    try {
      // Convert mechanicId string to ObjectId for comparison
      const mechanicObjectId = new mongoose.Types.ObjectId(mechanicId);

      // Use aggregation to get all completed services where mechanic was involved
      const result = await concernModel.aggregate([
        {
          $match: {
            isDeleted: false,
            status: "completed",
            $or: [
              { currentMechanicId: mechanicObjectId },
              { "workHistory.mechanicId": mechanicObjectId },
            ],
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
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "currentMechanicId",
            foreignField: "_id",
            as: "currentMechanicDetails",
          },
        },
        {
          $addFields: {
            mechanicWorkHistory: {
              $filter: {
                input: "$workHistory",
                cond: { $eq: ["$$this.mechanicId", mechanicObjectId] },
              },
            },
          },
        },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            "userDetails.password": 0,
            "currentMechanicDetails.password": 0,
          },
        },
      ]);

      console.log("Mechanic completed service history:", result);
      return result as GetAllMechanicCompletedServicesResponse[];
    } catch (error) {
      console.log(
        "Error occurred while fetching mechanic completed service history:",
        error as Error
      );
      throw new Error(
        "Error occurred while fetching mechanic completed service history."
      );
    }
  }

  //function to update the orderid in the concern data base after payment optoin
  async updateConcernWithOrderId(
    complaintId: string,
    orderId: string
  ): Promise<UpdatedcomplaintWithOrderIdResponse | null> {
    try {
      console.log("Entered in the updatedConcernOrderId");
      const objectIdObject = new mongoose.Types.ObjectId(orderId);
      const qr = { orderId: objectIdObject };
      const result = await this.update(complaintId, qr);
      return result;
    } catch (error) {
      console.log(
        "Error occured in the updateconcernWithOrderId in concernRepository",
        error
      );
      throw error;
    }
  }
}

export default ConcernRepository;
