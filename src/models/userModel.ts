import { Schema, model } from 'mongoose';
import { userModelProps } from '../types/schema';


const userSchema = new Schema({

  userId: { type: String, unique: true },
  userName: { type: String },
  userType: { type: String,required:true},
  points: { type: Number, required: true, default: 0 },
  discordId: { type: String, required: false, unique: true },
  status: { type: String, required: true },
  name:{type:String },
  walletAddress:{type:String},
  socialPlatforms: [{ type: Schema.Types.ObjectId, ref: 'SocialPlatform' }],
  tasksCompleted: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
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

export const findUserByUserIdAndWalletAddress = async (userId: string, walletAddress: string,userName:string) => {
  try {
    // Find the user by wallet address
   
    
    let user = await UserModel.findOne({ walletAddress }).exec();
     
    
    if (user) {
      if (!user.userId) { 
        user.userId = userId;
        user.userName=userName;
        user.points=400;
        
        await user.save(); 
     
      }
    } 
   
    
    return user;
  } catch (error) {
    console.error('Error finding or updating user:', error);
    throw error;
  }
};



export const findWalletAddress = async (walletAddress:string) => {
  try {
    return await UserModel.findOne({ walletAddress }).exec();
  } catch (error) {
    console.error('Error finding user by userId:', error);
    throw error;
  }
};
