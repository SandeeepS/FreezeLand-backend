interface User{
    id?: string | undefined;
    name?: string;
    email?: string;
    phone?: number;
    password?: string | Promise<string>;
    isDeleted?: boolean;
    isBlocked?: boolean;

}

export default User;