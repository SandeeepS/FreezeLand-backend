import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  password: string;
  email: string;
  phone: number;
  isBlocked: boolean;
  isDeleted: boolean;
  profile_picture: string;
}

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
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const userModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "User",
  userSchema
);
export default userModel;
