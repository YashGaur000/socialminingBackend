import { Schema, model } from 'mongoose';
import { ISocialPlatform } from '../types/schema';

const socialPlatformSchema = new Schema<ISocialPlatform>({
    platform: { type: String, enum: ['twitter', 'reddit', 'telegram', 'discord'], required: true },
    userIdentifier: { type: String, required: true },
    platformUserName:{type:String},
    joined: { type: Boolean, default: false },
    joinDate: { type: Date },
  
    pointsEarned: { type: Number, default: 0 }
  });
  
  const SocialPlatform = model<ISocialPlatform>('SocialPlatform', socialPlatformSchema);
  export default SocialPlatform;
  



  
  export const updateTwitterStatus = async (userIdentifier: string, joined: boolean,pointsEarned) => {
    try {
      console.log("status",joined);
      console.log(userIdentifier);
     
      return await SocialPlatform.updateOne({ userIdentifier }, { $set: { joined,pointsEarned} }).exec();
  
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };
  

  export const findOrCreateSocialPlatform = async (platform: string, userIdentifier: string, platformUserName?: string) => {
    try {
      
      const existingPlatform = await SocialPlatform.findOne({ platform, userIdentifier }).exec();
  
      if (existingPlatform) {
        return existingPlatform; 
      } else {
        const newPlatform = new SocialPlatform({
          platform,
          userIdentifier,
          platformUserName,
          joined: true, 
          pointsEarned:400,
        });
  
        await newPlatform.save();
        return newPlatform; 
      }
    } catch (error) {
      console.error('Error finding or creating social platform entry:', error);
      throw error;
    }
  };


  