import Admin from "../entityInterface/Iadmin"
import Mech from "../entityInterface/Imech"
import UserInterface from "../entityInterface/Iuser"
import { IMechsAndCount } from "../serviceInterfaces/InMechService"
import { IUsersAndCount } from "../serviceInterfaces/InaAdminService"
import MechInterface from "../entityInterface/Imech"



export type AllResTypes = Admin | Mech | UserInterface | UserInterface[] | null | IUsersAndCount |IMechsAndCount | MechInterface[]

export interface IApiRes<T extends AllResTypes> {
    status: number,
    message: string,
    data: T 
}