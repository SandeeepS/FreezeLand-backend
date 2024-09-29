import Cryptr = require("cryptr");

interface compareInterface {
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

class Encrypt implements compareInterface {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const secret_key:string | undefined= process.env.CRYPTR_SECRET;
    if(!secret_key){
      throw new Error("Encrption secret key is not defined in the environment");
    }
    const cryptr = new Cryptr(secret_key);
    const becrypedPassword = cryptr.decrypt(hashedPassword);

    
    if (password === becrypedPassword) {
      return true;
    } else {
      console.log("Password is note mathched ");
      return false;
    }
  }
}

export default Encrypt;
