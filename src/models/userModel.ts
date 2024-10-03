import { Schema, model } from 'mongoose';


const userSchema = new Schema({
  userId: { type: Number, required: true, unique: true }, 
  userName: { type: String, required: true }, 
  userType: { type: String, required: true }, 
  points: { type: Number, required: true, default: 0 }, 
  status: { type: String, required: true }, 
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}); 

export const UserModel = model('User', userSchema);


export const findUserByUserId = (userId: number) => {
  return UserModel.findOne({ userId }).exec(); 
};


export const createUser = async (userData: any) => {
  try {
    const newUser = new UserModel(userData); 
    return await newUser.save(); 
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; 
  }
};


export const updateUserStatus = async (userId: number, status: string) => {
  try {
    return await UserModel.updateOne({ userId }, { $set: { status } }).exec(); 
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error; 
  }
};
