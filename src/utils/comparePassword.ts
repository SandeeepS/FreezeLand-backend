import Cryptr = require("cryptr");
import dotenv from 'dotenv'

interface compareInterface {
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

class Encrypt implements compareInterface {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try{
      const secret_key:string | undefined= process.env.CRYPTR_SECRET;
      if(!secret_key){
        throw new Error("Encrption secret key is not defined in the environment");
      }
      const cryptr = new Cryptr(secret_key,{ encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
      const becrypedPassword = cryptr.decrypt(hashedPassword);
  
      
      if (password === becrypedPassword) {
        return true;
      } else {
        console.log("Password is note mathched ");
        return false;
      }
    
    }catch(error){
       console.log("error while decrypting the password",error as Error);
       return false;
    }
  }
 
}

export default Encrypt;
