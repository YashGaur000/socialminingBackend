import SocialPlatform from '../models/SocialPlatformModel';
import { createUser, findUserByUserId } from '../models/userModel';
import { ISocialPlatform} from '../types/schema';
import dotenv from "dotenv"
dotenv.config();
const Bot_id= process.env.BOT_TOKEN;
export const generateAuthUrl = (): string => {
  const telegramAuthUrl = `https://telegram.org/auth?bot_id=${Bot_id}onhrek&scope=user:read`; 
  return telegramAuthUrl;
};

export const handleTelegramAuth = async (queryParams: any): Promise<ISocialPlatform | null> => {
  try {
    const { user_id, username, first_name } = queryParams;

  
    const userIdentifier = username || user_id;
   console.log();
   
  
   
    const existingUser = await SocialPlatform.findOne({ userIdentifier, platform: 'telegram' });
    console.log(existingUser);
    
    if (existingUser) {
    
      return existingUser;
    } else {
    
      // const newUser = new SocialPlatform({
      //   platform: 'telegram',
      //   userIdentifier: userIdentifier, 
      //   joined: true, 
      //   joinDate: new Date(),
      //   pointsEarned: 400,
  
      // });

      // // Save the new user to the database
      // const createdUser = await newUser.save();
      // return createdUser;
      return existingUser
    }
  } catch (error) {
    console.error('Error in handleTelegramAuth:', error);
    return null;
  }
};
