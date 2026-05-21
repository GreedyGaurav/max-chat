import mongoose, { Schema, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  googleId: string;
  email: string;
  name?: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);
export default User;
