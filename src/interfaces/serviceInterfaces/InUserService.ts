import { UserInterface } from "../../models/userModel";

export interface UserResponseInterface {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: UserInterface,
        userId?: string;
        token?: string;
        refresh_token?: string;
    };
}