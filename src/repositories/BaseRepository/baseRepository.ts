import { Model } from "mongoose";
import { ObjectId } from "mongodb";

interface Deletable {
  isDeleted: boolean;
}

interface Searchable extends Deletable {
  name: string;
  email: string;
}

export interface IBaseRepository<T> {
  save(item: Partial<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  update(id: string, qr: Partial<T>): Promise<T | null>;
  updateAddress(_id: string, qr: Partial<T>): Promise<T | null>;
  editExistAddress(
    _id: string,
    addressId: string,
    qr: Partial<T>
  ): Promise<T | null>;
}

export class BaseRepository<T extends Searchable>
  implements IBaseRepository<T>
{
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(item: Partial<T>): Promise<T | null> {
    try {
      const newItem = new this.model(item);
      await newItem.save();
      return newItem as T;
    } catch (error) {
      console.log("Error in BaseRepository save:", error as Error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return (await this.model.findById(id)) as T;
    } catch (error) {
      console.log("Error in BaseRepository findById:", error as Error);
      throw error;
    }
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    try {
      console.log("filter is from UserBaseRepositoy is ", filter);
      return (await this.model.findOne(filter)) as T;
    } catch (error) {
      console.log("Error in BaseRepository findOne:", error as Error);
      throw error;
    }
  }

  async update(id: string, qr: Partial<T>): Promise<T | null> {
    try {
      return (await this.model.findByIdAndUpdate(
        id,
        { $set: qr },
        { new: true }
      )) as T;
    } catch (error) {
      console.log("Error in BaseRepository update:", error as Error);
      throw error;
    }
  }

  async updateAddress(id: string, qr: Partial<T>): Promise<T | null> {
    try {
      console.log("id", id);

      console.log("qr", qr);
      const objectId = new ObjectId(id);
      return (await this.model.findByIdAndUpdate(
        objectId,
        { $push: qr },
        { new: true }
      )) as T;
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async editExistAddress(
    _id: string,
    addressId: string,
    values: Partial<T>
  ): Promise<T | null> {
    try {
      const objectId = new ObjectId(_id);
      const newAddressId = new ObjectId(addressId);

      return await this.model.findOneAndUpdate(
        { _id: objectId, "address._id": newAddressId },
        {
          $set: {
            "address.$": values,
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    regex: RegExp
  ): Promise<T[] | null> {
    try {
      return await this.model
        .find({
          isDeleted: false,
          $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password")
        .exec();
    } catch (error) {
      console.log(
        "Error while getting the user details from the baseRepository",
        error
      );
      return null;
    }
  }

  //for counting the userData
  async countDocument(regex: RegExp): Promise<number> {
    try {
      return await this.model.countDocuments({
        $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
      });
    } catch (error) {
      console.log(
        "error while getting the count of the document in the baseRepository",
        error
      );
      throw new Error();
    }
  }
}
