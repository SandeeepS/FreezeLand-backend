import mongoose, { Schema, Document, Model } from "mongoose";

export interface MechInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  mechanicType:string[];
  photo: string;
  adharProof: string;
  employeeLicense : string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

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
  employeeLicense : {
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

const MechModel: Model<MechInterface> = mongoose.model<MechInterface>(
  "Mech",
  mechSchema
);
export default MechModel;
