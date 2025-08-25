import mongoose, { Schema, Model } from "mongoose";
import { ITempMech, MechInterface } from "../interfaces/Model/IMech";

const AddressSchema = new Schema({
  name: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  state: { type: String, require: true },
  pin: { type: Number, require: true },
  district: { type: String, require: true },
  landMark: { type: String, require: true },
  isDeleted: { type: Boolean, default: false },
});

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

const mechSchema: Schema<MechInterface> = new Schema({
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
    required: true,
  },

  role: {
    type: String,
    default: "mechanic",
    required: true,
  },

  address: {
    type: [AddressSchema],
    required: false,
  },

  mechanicType: {
    type: [String],
    required: false,
  },

  profile_picture: {
    type: String,
    required: false,
  },

  adharProof: {
    type: String,
    required: false,
  },

  employeeLicense: {
    type: String,
    required: false,
  },
  locationData: LocationDataSchema,

  wallet: {
    type: Number,
    default: 0,
  },

  isVerified: {
    type: Boolean,
    default: false,
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

const TempMechSchema: Schema<ITempMech> = new Schema(
  {
    mechData: {
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

const MechModel: Model<MechInterface> = mongoose.model<MechInterface>(
  "Mech",
  mechSchema
);

export const TempMech = mongoose.model<ITempMech>(
  "TempMechData",
  TempMechSchema
);
export default MechModel;
