import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  username: string;
  password: string;
  gender: 'male' | 'female';
  profilePic: string;
}

const userSchema: Schema<IUser> = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  profilePic: {
    type: String,
    default: '',
  },
}, {timestamps: true});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;

