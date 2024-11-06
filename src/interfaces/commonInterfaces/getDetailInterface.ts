import Admin from "../entityInterface/Iadmin"
import Mech from "../entityInterface/Imech"
import UserInterface from "../entityInterface/Iuser"
import { IMechsAndCount } from "../serviceInterfaces/InMechService"
import { IUsersAndCount } from "../serviceInterfaces/InaAdminService"
import { IUserServiceAndCount } from "../serviceInterfaces/userServiceInterfaces"
import { IUserDeviceAndCount } from "../serviceInterfaces/userDeviceResponseInterfaces"
import MechInterface from "../entityInterface/Imech"
import Iservices from '../entityInterface/Iservices'




export type AllResTypes = Admin | Mech | UserInterface | IUserDeviceAndCount | Iservices | UserInterface[] | null | IUsersAndCount |IMechsAndCount | MechInterface[] | IUserServiceAndCount

export interface IApiRes<T extends AllResTypes> {
    status: number,
    message: string,
    data: T 
}