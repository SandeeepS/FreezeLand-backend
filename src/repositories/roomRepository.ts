import {
  ICreateRoomData,
  ICreateRoomResponse,
} from "../interfaces/dataContracts/Room/IRepository";
import { IRoomRepository } from "../interfaces/IRepository/IRoomRepository";
import { IRoom } from "../interfaces/Model/IRoom";
import roomModel from "../models/roomModel";
import { BaseRepository } from "./BaseRepository/baseRepository";

class RoomRepository extends BaseRepository<IRoom> implements IRoomRepository {
  constructor() {
    super(roomModel);
  }

  async createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> {
    try {
      console.log("entered in the roomRepository");
      const dataToSave = new roomModel({
        userId: data.userId,
        mechId: data.mechId,
      });
      const savedRoomData = await dataToSave.save();
      console.log("saved room data is", savedRoomData);
      const roomId = savedRoomData._id.toString();
      return { id: roomId };
    } catch (error) {
      console.log(error as Error);
      throw error;
    }
  }
}

export default RoomRepository;
