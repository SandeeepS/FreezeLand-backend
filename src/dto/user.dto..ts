
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    phone: Number;
    isBlocked:boolean;
    isDeleted:boolean;

  }
  
  export interface UserLoginDTO {
    email: string;
    password: string;
  }
  
  export interface UserResponseDTO{
    id?: string;
    name?: string;
    email?: string;
    password?:string;
    phone?: Number;
    token?: string;
    refreshToken?: string;
    isBlocked:boolean;
    isDeleted:boolean;
  }
  