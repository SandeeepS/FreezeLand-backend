import { Model } from "mongoose";

// baseRepository.ts
export interface IBaseRepository<T> {
    save(item: Partial<T>): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    findOne(filter: Partial<T>): Promise<T | null>;
    update(id: string, item: Partial<T>): Promise<T | null>;
  }
  
  export class UserBaseRepository<T> implements IBaseRepository<T> {
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
        return await this.model.findById(id) as T;
      } catch (error) {
        console.log("Error in BaseRepository findById:", error as Error);
        throw error;
      }
    }
  
    async findOne(filter: Partial<T>): Promise<T | null> {
      try {
        console.log("filter is from UserBaseRepositoy is ",filter);
        return await this.model.findOne(filter) as T;
      } catch (error) {
        console.log("Error in BaseRepository findOne:", error as Error);
        throw error;
      }
    }
  
    async update(id: string, item: Partial<T>): Promise<T | null> {
      try {
        return await this.model.findByIdAndUpdate(id, item, { new: true }) as T;
      } catch (error) {
        console.log("Error in BaseRepository update:", error as Error);
        throw error;
      }
    }
  }
  