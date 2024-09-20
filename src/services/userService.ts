import { UserInterface } from "../models/userModel";
import UserRepository from "../repositories/userRepository";

// const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = STATUS_CODES;


class userService {
    constructor(private userRepository:UserRepository,
        
    ){}


    async signupUser(userData:UserInterface):Promise <any>{
        try{
            const user = await this.userRepository.saveUser(userData);
            if(user){
                console.log("user is registered ");
            }
        }catch(error){
            console.log(error as Error);

        }
    }
}

export default userService