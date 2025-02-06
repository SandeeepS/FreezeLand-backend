interface Admin {
  id?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: number;
  role?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
}

export default Admin;
