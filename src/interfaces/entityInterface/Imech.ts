interface Mech {
    id?: string;
    name?: string;
    email?: string;
    password?: string ;
    phone?:number;
    isBlocked?:boolean; 
    isDeleted?:boolean; 
}

export default Mech;