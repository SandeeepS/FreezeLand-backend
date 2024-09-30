import { MechInterface } from "../../models/mechModel";

export interface MechResponseInterface {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: MechInterface;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}



