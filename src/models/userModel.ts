import mongoose, { Schema, Model } from "mongoose";
import { ITempUser, UserInterface } from "../interfaces/Model/IUser";

const AddressSchema = new Schema({
  name: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  state: { type: String, require: true },
  pin: { type: Number, require: true },
  district: { type: String, require: true },
  landMark: { type: String, require: true },
});



const userSchema: Schema<UserInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
  },

  profile_picture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png",
  },

  address: {
    type: [AddressSchema],
    required: false,
  },

  defaultAddress: {
    type: String,
  },

  role: {
    type: String,
    default: "user",
    required: true,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});


const TempUserShcema : Schema <ITempUser> = new Schema({
  userData:{
    type:Object,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires:900 
  }
},
{
  timestamps:true,
})

const userModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "User",
  userSchema
);
export const TempUser = mongoose.model<ITempUser>("TempUserData",TempUserShcema)
export default userModel;
