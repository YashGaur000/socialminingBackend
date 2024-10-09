import SocialPlatform, { updateTwitterStatus } from '../models/SocialPlatformModel';
import { createUser, findUserByUserId, updateUserStatus } from '../models/userModel';
import { userModelProps } from '../types/schema';

interface Member {
  id: number;            
  first_name: string;    
  username?: string;     
}

export const handleNewMemberJoin = async (member: Member, chatId: number, bot: any) => {

  console.log('New member details:', member); 

  const userId= (member.id).toString();
  const memberName = member.first_name;
  const memberUsername = member.username || member.first_name || 'Unknown';
  const userIdentifier=userId;
  try {
      const existingUser = await SocialPlatform.findOne({ userIdentifier, platform: 'telegram' });
      console.log(existingUser);
      
      if (existingUser) {
          if (existingUser.joined === false) {
              await updateTwitterStatus(userId.toString(), true,400); 
              bot.sendMessage(chatId, `${memberName} rejoined the group. No points awarded.`);
          } else {
              bot.sendMessage(chatId, `${memberName} is already a member. No points awarded.`);
          }
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
        console.log("created user" ,createUser);
        
        return createdUser;

          
          const welcomeMessage = memberUsername !== 'Unknown'
            ? `Welcome ${memberName}! You've been awarded 500 points.`
            : `Welcome ${memberName} (no username)! You've been awarded 500 points.`;

          bot.sendMessage(chatId, welcomeMessage);
      }
  } catch (error) {
      console.error('Error handling new member join:', error);
      bot.sendMessage(chatId, 'There was an error processing your join request.');
  }
};



export const handleMemberLeave = async (member: Member, chatId: number, bot: any) => {
  const userId = member.id;
  const memberName = member.first_name;

  try {

    const existingUser =  await SocialPlatform.findOne({ userIdentifier:userId, platform: 'telegram' });
    console.log(existingUser);
    
    if (existingUser) {
      // await updateUserStatus(userId.toString(), false); 
      console.log("leftstatus" ,userId);
      
      await updateTwitterStatus(userId.toString(),false,0);
      bot.sendMessage(chatId, `${memberName} has left the group.`);
    }
  } catch (error) {
    
    console.error('Error handling member leave:', error);
    bot.sendMessage(chatId, 'There was an error processing your leave request.');
  }
};
