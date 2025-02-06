export interface EmailExitCheck {
  email: string;
}

export interface SaveMechDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface SaveMechResponse {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  isVerified: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
}

export interface UpdateNewPasswordDTO {
  password: string;
  userId: string;
}
