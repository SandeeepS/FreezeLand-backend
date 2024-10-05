import mongoose, { Schema, Document, Model } from "mongoose";

export interface MechInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: number;
  isBlocked: boolean;
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
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const MechModel: Model<MechInterface> = mongoose.model<MechInterface>(
  "Mech",
  mechSchema
);
export default MechModel;
