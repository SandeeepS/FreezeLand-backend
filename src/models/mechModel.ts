import mongoose, { Schema, Model } from "mongoose";
import { ITempMech, MechInterface } from "../interfaces/Model/IMech";

const AddressSchema = new Schema({
  fullAddress: { type: String, required: true },
  houseNumber: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  landmark: { type: String, require: true },
  isDeleted: { type: Boolean, default: false },
  isDefaultAddress: { type: Boolean, default: false },
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
