import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  name?: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema: Schema<UserDocument> = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export default UserModel;
