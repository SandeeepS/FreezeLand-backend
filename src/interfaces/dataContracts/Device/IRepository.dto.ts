export interface IGetAllDevices{
    page: number;
    limit: number;
    filter:string;
    search:string;
  }
  
  export interface GetAllDevicesResponse {
    name: string;
    isBlocked: boolean;
    isDeleted: boolean;
  }

  export interface IGetDeviceCount {
    search: string;
  }
  export interface AddNewDeviceResponse {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}