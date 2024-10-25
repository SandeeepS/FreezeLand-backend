
import Mech from "../entityInterface/Imech";

export interface MechResponseInterface {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: Mech;
    mechId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface IMechsAndCount{
    mechs:Mech[],
    mechsCount:number
}


