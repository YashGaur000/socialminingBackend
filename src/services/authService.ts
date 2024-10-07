import SocialPlatform from '../models/SocialPlatformModel';
import { createUser, findUserByUserId } from '../models/userModel';
import { ISocialPlatform} from '../types/schema';

export const generateAuthUrl = (): string => {
  const telegramAuthUrl = `https://telegram.org/auth?bot_id=7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4&scope=user:read`; 
  return telegramAuthUrl;
};

export const handleTelegramAuth = async (queryParams: any): Promise<ISocialPlatform | null> => {
  try {
    const { user_id, username, first_name } = queryParams;

  
    const userIdentifier = username || user_id;


    const existingUser = await SocialPlatform.findOne({ userIdentifier, platform: 'telegram' });

    if (existingUser) {
    
      return existingUser;
    } else {
    
      const newUser = new SocialPlatform({
        platform: 'telegram',
        userIdentifier: userIdentifier, 
        joined: true, 
        joinDate: new Date(),
        pointsEarned: 400,
        
      });

      // Save the new user to the database
      const createdUser = await newUser.save();
      return createdUser;
    }
  } catch (error) {
    console.error('Error in handleTelegramAuth:', error);
    return null;
  }
};
