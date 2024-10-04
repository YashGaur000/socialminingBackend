import { Schema, model } from 'mongoose';

export interface userModelProps{

  userId:string;
  userName:string;
  userType:string;
  name?:string;
  points:number;
  status:string;
}

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userType: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  status: { type: String, required: true },
  name:{type:String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const UserModel = model('User', userSchema);

export const createUser = async (userData: userModelProps) => {
  try {
    const newUser = new UserModel(userData);
    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await UserModel.findOne({ email }).exec();
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

export const findUserByUserId = async (userId: string) => {
  try {
    return await UserModel.findOne({ userId }).exec();
  } catch (error) {
    console.error('Error finding user by userId:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    return await UserModel.updateOne({ userId }, { $set: { status } }).exec();
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};
