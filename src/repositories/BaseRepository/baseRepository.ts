import { Model } from "mongoose";
import { Iconcern } from "../../models/concernModel";
import { IRegisterService } from "../../interfaces/dataContracts/User/IService.dto";

interface Deletable {
  isDeleted: boolean;
}

interface Searchable extends Deletable {
  name?: string;
  email?: string;
}

export interface IBaseRepository<T> {
  save(item: Partial<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  update(id: string, qr: Partial<T>): Promise<T | null>;
  addService(values: string): Promise<T | null>;
  addConcern(data: Iconcern): Promise<T | null>;
}

export  class BaseRepository<T extends Searchable>
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

  async find(query: Partial<T>): Promise<T[] | null> {
    try {
      const messages = await this.model.find(query);
      return messages as T[];
    } catch (error) {
      console.log("Error in base repository find method", error as Error);
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
      console.log("filter is from BaseRepositoy is ", filter);
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

  async findAll(
    page: number,
    limit: number,
    regex: RegExp | null
  ): Promise<T[] | null> {
    try {
      console.log("Regex in the baserepo", regex);
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

  async findAll2(): Promise<T[] | null> {
    try {
      return await this.model.find({
        isDeleted: false,
      });
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

  async addService(values: string): Promise<T | null> {
    try {
      const newSerive = new this.model(values);
      await newSerive.save();
      return newSerive as T;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addConcern(data: IRegisterService): Promise<T | null> {
    try {
      const newConcern = new this.model(data);
      await newConcern.save();
      return newConcern as T;
    } catch (error) {
      console.log(
        "error from the addconcern form the baseRepository is ",
        error as Error
      );
      throw Error;
    }
  }

  async addDevice(name: string): Promise<T | null> {
    try {
      const newSerive = new this.model({ name: name });
      await newSerive.save();
      return newSerive as T;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
