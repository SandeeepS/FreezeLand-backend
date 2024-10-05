import User from "../entityInterface/Iuser";

export interface UserResponseInterface {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: User;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}
