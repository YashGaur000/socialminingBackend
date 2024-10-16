import { UserModel } from "../models/userModel";
import { ISocialPlatform } from "../types/schema";

export const findbyIdAndSocialPlatform=async(userId,telegramPlatform)=>{

    try {
        const user = await UserModel.findOne({ userId: userId });
        if (user) {
         
         
         
          const existingTelegramIndex = user.socialPlatforms.findIndex(p => p.platform === 'telegram');
          if (existingTelegramIndex ) {
            
             return;
          } else {
            
            user.socialPlatforms.push(telegramPlatform);
          }
    
          await user.save();
          console.log(`Updated user ${userId} with Telegram information`);
        } else {
          console.log(`User ${userId} not found in the database`);
        }
      } catch (error) {
        console.error(`Error updating user ${userId} with Telegram information:`, error);
      }

}

