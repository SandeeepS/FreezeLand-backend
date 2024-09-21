import mongoose,{Schema,Document,Model} from "mongoose";

export interface UserInterface extends Document{
      _id:mongoose.Types.ObjectId;
      name:string;
      password:string;
      email:string;
      phone:Number;
      isBlocked:boolean;
      
}

const userSchema:Schema<UserInterface> = new Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
})

const userModel:Model<UserInterface> = mongoose.model<UserInterface>('User',userSchema);
export default userModel;