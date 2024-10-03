import { createUser, findUserByUserId, updateUserStatus } from '../models/userModel';

interface Member {
  id: number;            
  first_name: string;    
  username?: string;     
}

export const handleNewMemberJoin = async (member: Member, chatId: number, bot: any) => {
  console.log('New member details:', member); 
  const userId = member.id;
  const memberName = member.first_name;
  const memberUsername = member.username || member.first_name || 'Unknown';

  try {
      const existingUser = await findUserByUserId(userId);

      if (existingUser) {
          if (existingUser.status === 'left') {
              await updateUserStatus(userId, 'true'); 
              bot.sendMessage(chatId, `${memberName} rejoined the group. No points awarded.`);
          } else {
              bot.sendMessage(chatId, `${memberName} is already a member. No points awarded.`);
          }
      } else {
          const newUser = {
              userId,
              userName: memberUsername,  
              userType: 'telegram',
              points: 500,
              status: 'join',
          };

          await createUser(newUser); 

          
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

    const existingUser = await findUserByUserId(userId);

    if (existingUser) {
      await updateUserStatus(userId, 'false'); 
      bot.sendMessage(chatId, `${memberName} has left the group.`);
    }
  } catch (error) {
    
    console.error('Error handling member leave:', error);
    bot.sendMessage(chatId, 'There was an error processing your leave request.');
  }
};
