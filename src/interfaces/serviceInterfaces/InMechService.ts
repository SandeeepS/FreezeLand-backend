
import { MechInterface } from "../../models/mechModel";
import Admin from "../entityInterface/Iadmin";
import Mech from "../entityInterface/Imech";

export interface MechResponseInterface {
  status: number;
  data: {
    success: boolean;
    message: string;
    data?: Admin | MechInterface;
    userId?: string;
    token?: string;
    refresh_token?: string;
  };
}

export interface IMechsAndCount{
    mechs:Mech[],
    mechsCount:number
}


