import { ICreateRoomData, ICreateRoomResponse } from "../dataContracts/Room/IRepository";

export interface IRoomRepository{
createRoom(data: ICreateRoomData): Promise<ICreateRoomResponse> 
}