export interface EmailExistCheckDTO {
    email:string,
}

export interface EmailExistCheckResponse{
    id?: string;
    name: string;
    password: string;
    email: string;
    phone: number;
    profile_picture: string;
    address: {
      name: string;
      phone: number;
      email: string;
      state: string;
      pin: number;
      district: string;
      landMark: string;
    }[];
    defaultAddress:string;
    isBlocked: boolean;
    isDeleted: boolean;
}

