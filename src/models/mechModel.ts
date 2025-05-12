import mongoose, { Schema, Document, Model } from "mongoose";
import { ITempMech, MechInterface } from "../interfaces/Model/IMech";

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
  mechanicType: {
    type: [String],
    required: false,
  },
  photo: {
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
