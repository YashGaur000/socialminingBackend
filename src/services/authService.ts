import { createUser, findUserByUserId } from '../models/userModel';

export const generateAuthUrl = (): string => {
  const telegramAuthUrl = `https://telegram.org/auth?bot_id=7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4&scope=user:read`; 
  return telegramAuthUrl;
};

export const handleTelegramAuth = async (queryParams: any): Promise<any> => {
  const { user_id, username, first_name } = queryParams; 
  
  
  const user = await findUserByUserId(user_id);

  if (user) {
  
    return user;
  } else {
  
    const newUser = {
      userId: user_id,
      userName: username || first_name,  
      userType: 'telegram',
      points: 0,
      status: 'auth_completed'
    };
    
    await createUser(newUser);  
    return newUser;  
  }
};
