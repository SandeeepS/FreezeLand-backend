import Device from "../entityInterface/Idevice";

export interface UserDeviceResponseInterfaces {
  status: number;
  data: {
    success: boolean;
    messages: string;
    data?: Device;
  };
}

export interface IUserDeviceAndCount {
  devices: Device[];
  devicesCount: number;
}
