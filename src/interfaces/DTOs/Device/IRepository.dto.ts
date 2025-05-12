export interface GetAllDevicesDTO {
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

  export interface GetDeviceCountDTO {
    searchQuery: string;
  }
  