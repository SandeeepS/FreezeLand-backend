import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface AdminInterface extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

const adminSchema: Schema<AdminInterface> = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const AdminModel: Model<AdminInterface> = mongoose.model<AdminInterface>(
  "admin",
  adminSchema
);
export default AdminModel;
