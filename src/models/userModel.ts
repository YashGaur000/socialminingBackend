import { Schema, model } from 'mongoose';

export interface userModelProps{

  userId:string;
  userName:string;
  name?:string;
  discordId?:string;
  points:number;
  status:string;
  twitterId?: string;
  username?: string;
  displayName?: string;
  twitterToken?: string;
  twitterRefreshToken?: string;
  discordUsername?: string;
  discordToken?: string;
  walletAddress?: string;
  telegramId?: string;
  telegramToken?: string;
  userType:string;
}

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userType: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  discordId: { type: String, required: false, unique: true },
  status: { type: String, required: true },
  name:{type:String },
  displayName: {type:String },
  twitterToken: {type:String },
  twitterRefreshToken: {type:String },
  discordUsername: {type:String },
  discordToken: {type:String },
  walletAddress: {type:String },
  telegramId: {type:String },
  telegramToken:{type:String }
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

export const findUserByDiscordId = async (discordId: string) => {
  try {
    return await UserModel.findOne({ discordId }).exec();
  } catch (error) {
    console.error('Error finding user by userId:', error);
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
