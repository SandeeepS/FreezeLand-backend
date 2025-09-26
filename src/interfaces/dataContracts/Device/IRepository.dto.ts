export interface IGetAllDevices{
    page: number;
    limit: number;
    searchQuery: string;
    search:string;
  }
  
  export interface GetAllDevicesResponse {
    name: string;
    isBlocked: boolean;
    isDeleted: boolean;
  }

  export interface IGetDeviceCount {
    searchQuery: string;
  }
  export interface AddNewDeviceResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}