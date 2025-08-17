import mongoose, { Schema, Model } from "mongoose";
import { ITempUser, UserInterface } from "../interfaces/Model/IUser";

const LocationDataSchema = new Schema({
  type: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

//userSchema
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
    type: Schema.Types.ObjectId,
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

  locationData: LocationDataSchema,
  wallet: {
    type: Number,
    default: 0,
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

//tempSchema
const TempUserShcema: Schema<ITempUser> = new Schema(
  {
    userData: {
      type: Object,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900,
    },
  },
  {
    timestamps: true,
  }
);

const userModel: Model<UserInterface> = mongoose.model<UserInterface>(
  "User",
  userSchema
);
export const TempUser = mongoose.model<ITempUser>(
  "TempUserData",
  TempUserShcema
);
export default userModel;
