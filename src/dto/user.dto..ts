
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
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
  