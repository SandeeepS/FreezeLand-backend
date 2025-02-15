interface Mech {
    id?:string;
    name: string;
    email: string;
    password?: string ;
    phone:number;
    role:string;
    isVerified:boolean;
    isBlocked?:boolean; 
    isDeleted?:boolean; 
}

export default Mech;