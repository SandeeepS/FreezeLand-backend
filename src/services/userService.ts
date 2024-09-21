import { UserInterface } from "../models/userModel";
import UserRepository from "../repositories/userRepository";

// const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;


class userService {
    constructor(private userRepository:UserRepository,
    ){}
    async signupUser(userData:UserInterface):Promise <any>{
        try{
            console.log("Entered in user Service");
            const user = await this.userRepository.saveUser(userData);
            if(user){
                console.log("user is registered ");
            }
        }catch(error){
            console.log(error as Error);

        }
    }

    async userLogin(email:string,password:string):Promise<any>{
        try{
            const user : UserInterface | null = await this.userRepository.findEmail(email);
            if(user){
                 return user;
            }
        }catch(error){
            console.log("error occured in the userService while userLogin",error as Error);
            return null;
        }
    }
}

export default userService