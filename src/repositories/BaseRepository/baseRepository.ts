import { Model } from "mongoose";

export interface IBaseRepository<T> {
  save(item: Partial<T>): Promise<T | null>;
  find(query: Partial<T>): Promise<T[] | null>;
  findById(id: string): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  update(id: string, qr: Partial<T>): Promise<T | null>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(item: Partial<T>): Promise<T | null> {
    const newItem = new this.model(item);
    await newItem.save();
    return newItem as T;
  }

  async find(query: Partial<T>): Promise<T[] | null> {
    const messages = await this.model.find(query);
    return messages as T[];
  }

  async findById(id: string): Promise<T | null> {
    return (await this.model.findById(id)) as T;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    console.log("filter is from BaseRepositoy is ", filter);
    return (await this.model.findOne(filter)) as T;
  }

  async update(id: string, qr: Partial<T>): Promise<T | null> {
    return (await this.model.findByIdAndUpdate(
      id,
      { $set: qr },
      { new: true }
    )) as T;
  }
}
