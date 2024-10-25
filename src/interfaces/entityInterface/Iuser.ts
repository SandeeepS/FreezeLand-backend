interface User{
    id?: string | undefined;
    name?: string;
    email?: string;
    phone?: number;
    password?: string ;
    isDeleted?: boolean;
    isBlocked?: boolean;
    profile_picture?:string;

}

export default User;