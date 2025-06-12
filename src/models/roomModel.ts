import mongoose,{Schema,Model} from "mongoose";
import { IRoom } from "../interfaces/Model/IRoom";



const RoomSchema : Schema = new Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    mechId:{type:mongoose.Types.ObjectId,required:true},
    createdAt:{type:Date,default:Date.now},
    isDeleted:{type:Boolean,default:false}
})

const roomModel : Model<IRoom> = mongoose.model<IRoom>(
    "Room",
    RoomSchema
);
export default roomModel;