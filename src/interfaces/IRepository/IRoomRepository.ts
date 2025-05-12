import { ICreateRoomData, ICreateRoomResponse } from "../DTOs/Room/IRepository";

export interface IRoomRepository{
createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> 
}