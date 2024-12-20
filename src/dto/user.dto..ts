
export interface CreateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    phone?: number;
    isBlocked?:boolean;
    isDeleted?:boolean;

  }
  
  export interface UserLoginDTO {
    email: string;
    password: string;
  }
  
  export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    token: string;
    refreshToken: string;
  }
  