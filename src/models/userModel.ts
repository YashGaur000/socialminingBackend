import { Schema, model } from 'mongoose';
import { userModelProps } from '../types/schema';
import { error } from 'console';


const userSchema = new Schema({
  userId: { 
    type: String, 
    unique: [true, 'userId must be unique'], 
    required: [true, 'userId is required']   
  },
  userName: { 
    type: String, 
    unique: [true, 'userName must be unique'], 
  },
  userType: { 
    type: String 
  },
  points: { 
    type: Number, 
    required: [true, 'points are required'],  
    default: 0 
  },
  
  walletAddress: { 
    type: String 
  },
  socialPlatforms: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'SocialPlatform' 
  }],
  totalTasksCompleted: 
  { 
    type: Number, 
    default: 0 
  },

  referredBy: {
     type: Schema.Types.ObjectId, ref: 'Referral', 
     default: null
    
    },
    referral: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

export const UserModel= model<userModelProps> ('User', userSchema);




//write Customize function-------------------------------------------------

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

export const updateUserStatus = async (userId: string, joined: boolean) => {
  try {
    console.log(joined);
    console.log(userId);
    
    return await UserModel.updateOne({ userId }, { $set: { joined} }).exec();

  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};



export const findUserByUserIdAndWalletAddress = async (userId: string, walletAddress: string, userName: string) => {
  try {
    
    const existingUser = await UserModel.findOne({
      $or: [
        { userId },
        { userName },
        { walletAddress: { $ne: '', $eq: walletAddress } }
      ]
    }).exec();
  console.log("exist",existingUser);
  
    if (existingUser) {
     

      if (existingUser.userName.startsWith('Guest') && userName && !userName.startsWith('Guest')) {
        existingUser.userName = userName;
        
        await existingUser.save();
      }

      if (!existingUser.walletAddress && walletAddress) {
        existingUser.walletAddress = walletAddress;
        existingUser.userType = 'wallet';
        await existingUser.save();
      }

      return existingUser;

     
    } else {
 
      const newUser = new UserModel({
        userId,
        userName,
        walletAddress,
        points: 0,
         
        userType: walletAddress ? 'wallet' : 'twitter',
      });

      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error('Error finding or creating user:', error);
    throw error;
  }
};


export const findWalletAddress = async (
  walletAddress:string) => {
  console.log(walletAddress);
  
  try {
    const users= await UserModel.findOne({ walletAddress }).exec();
    console.log(users);
    
   return users;
  } catch (error) {
    console.error('Error finding user by userId:', error);
    throw error;
  }
};
