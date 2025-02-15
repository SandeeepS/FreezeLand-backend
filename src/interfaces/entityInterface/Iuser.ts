interface Iuser{
    id?: string ;
    name: string;
    email: string;
    phone: number;
    password?: string;
    role: string;
    isDeleted: boolean;
    isBlocked: boolean;
    profile_picture:string;

}

export default Iuser;