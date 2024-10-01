import Admin from "../entityInterface/Iadmin";
import UserInterface from "../entityInterface/Iuser";


export interface AdminAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: Admin,
        adminId?: string;
        token?: string;
    };
}
export interface IUsersAndCount {
    users: UserInterface[],
    usersCount: number
}

