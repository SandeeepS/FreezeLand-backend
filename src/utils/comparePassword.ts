import bcrypt from "bcrypt";

interface compareInterface {
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

class Encrypt implements compareInterface {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    if (password === hashedPassword) {
      return true;
    } else {
      return false;
    }
  }
}

export default Encrypt;
