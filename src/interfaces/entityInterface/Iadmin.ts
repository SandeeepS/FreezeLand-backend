
interface Admin {
    id?: string;
    username?: string;
    password?: string;
    email?: string;
    phone?:number;
    isDeleted?:boolean;
    isBlocked?:boolean;
}

export default Admin;