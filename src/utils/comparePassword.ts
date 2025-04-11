import Cryptr from "cryptr";

 export interface compareInterface {
  compare(password: string, hashedPassword: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

class Encrypt implements compareInterface {
  private cryptr: Cryptr;

  constructor() {
    const secret_key: string | undefined = process.env.CRYPTR_SECRET;
    if (!secret_key) {
      throw new Error(
        "Encryption secret key is not defined in the environment"
      );
    }
    this.cryptr = new Cryptr(secret_key, {
      encoding: "base64",
      pbkdf2Iterations: 10000,
      saltLength: 10,
    });
  }

  // Encrypting the password instead of hashing
  async hashPassword(password: string): Promise<string> {
    try {
      const encryptedPassword = this.cryptr.encrypt(password);
      return encryptedPassword;
    } catch (error) {
      console.error("Error while encrypting the password:", error as Error);
      throw new Error("Failed to encrypt the password");
    }
  }

  // Decrypting the hashed password and comparing it with the plain text password
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const decryptedPassword = this.cryptr.decrypt(hashedPassword);
      return password === decryptedPassword;
    } catch (error) {
      console.error("Error while decrypting the password:", error as Error);
      return false;
    }
  }
}

export default Encrypt;
