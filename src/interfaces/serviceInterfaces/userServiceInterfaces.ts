import Iservices from '../entityInterface/Iservices'

export interface UserServiceResponseInterfaces {
    status:number;
    data: {
        success : boolean;
        messages : string;
        data?: Iservices;
    };
}

export interface IUserServiceAndCount{
    services:Iservices[],
    servicesCount:number
}