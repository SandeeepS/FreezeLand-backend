import mongoose, { Model } from "mongoose";
import IConcernRepository from "../interfaces/IRepository/IConcernRepository";
import concernModel, { Iconcern } from "../models/concernModel";
import { BaseRepository } from "./BaseRepository/baseRepository";
import { getComplaintDetailsResponse } from "../interfaces/DTOs/Concern/IRepository";

class ConcernRepository
  extends BaseRepository<Iconcern & Document>
  implements IConcernRepository
{
  constructor() {
    super(concernModel as unknown as Model<Iconcern & Document>);
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

}

export default ConcernRepository;
