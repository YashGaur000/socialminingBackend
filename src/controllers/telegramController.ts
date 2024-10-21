

import { Request, Response } from 'express';
import crypto, { createHash, createHmac } from 'crypto';
import dotenv from "dotenv"

import axios from 'axios';
import { ISocialPlatform } from '../types/schema';
import { findbyIdAndSocialPlatform } from '../utils/telegramQuery';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN|| '';
const BOT_INVITE = process.env.BOT_INVITE || '';

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const GROUP_ID=process.env.BOT_GROUPID;



const tokenToUserIdMap: { [token: string]: number } = {};

const generateToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

const saveTokenMapping = (token: string, userId: number) => {
  tokenToUserIdMap[token] = userId;
  console.log(`Saved mapping: Token ${token} => User ${userId}`);
};

const getUserIdByToken = (token: string): number | null => {
  return tokenToUserIdMap[token] || null;
};

const deleteTokenMapping = (token: string) => {
  if (token in tokenToUserIdMap) {
    delete tokenToUserIdMap[token];
    console.log(`Deleted mapping for token: ${token}`);
  }
};



export const generateTelegramLink=async (req:Request, res:Response) => {

  const {userId}=req.body;
  const botUsername ="socialmining13_bot" ; 
  const token = generateToken();

 

  saveTokenMapping(token, userId);

  
  const inviteLink = `https://t.me/${botUsername}?start=${token}`;
  console.log('Generated Invite Link:', inviteLink);

  res.json({
    inviteLink: inviteLink
   
  });
}


export const handleTelegramWebhook= async (req:Request, res:Response) => {
  const { message } = req.body;
  console.log("message",message);
  
  if (message && message.text) {
    if (message.text.startsWith('/start')) {
      await handleStartComand(message);
    } else {
      // Check group membership for any other message
      console.log("check");
      
      await checkAndHandleGroupMembership(message);
    }
  }
  res.sendStatus(200);
}

const handleStartComand=async(message)=>{


  const startToken = message.text.split(' ')[1];

  // if (!startToken) {
  //   await sendMessage(message.chat.id, "Please use the invite link to start the bot.");
  //  res.sendStatus(200);
  // }

 
    // const userId = getUserIdByToken(startToken);
   
    const userId="123"
    
    if (userId !== null) {
      deleteTokenMapping(startToken);
      const groupLink = "https://t.me/socialtenex1367";

      const welcomeMessage = `Welcome, ${message.chat.username}! 🎉 Your ID has been verified successfully.

      Here's what you need to do next:
      
      1. Join our official group by clicking this link: ${groupLink}
      2. After joining the group, Complete the taskList.
      
      Happy mining! 💎`;
      
          await sendMessage(message.chat.id, welcomeMessage);
     
      const telegramPlatform:ISocialPlatform={
        platform: 'telegram',
          userIdentifier: message.chat.id.toString(),
          platformUserName: message.chat.username || "",
          joined: false,
          joinDate: new Date(),
          pointsEarned: 0
      }
       try {
        
        await  findbyIdAndSocialPlatform(userId,telegramPlatform);
        
       } catch (error) {
           console.log(error);
           
       } 
            
    } else {
      await sendMessage(message.chat.id, "Invalid or expired token. Please generate a new invite link.");

    }
    
  } 




const sendMessage = async (chatId: number, text: string) => {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


const checkAndHandleGroupMembership = async (message: any) => {
  const chatId = message.chat.id;
  const userId = message.from.id;

  const isGroupMember = await checkGroupMembership(userId);
  // const user = await findUserById(userId);
  const user="1234"
  if (isGroupMember && user) {
    await handleJoinGroupCommand(message);
  } else {
    const groupLink = "https://t.me/socialtenex1367";
    const notJoinedMessage = `It seems you haven't joined our group or registered on our website yet. 

To earn points and participate in our social mining activities:

1. Join our official group: ${groupLink}
2. Visit our website to complete registration: ${`https://social.tenex.finance/`}

Once you've done both, come back here and send any message to verify your status.`;

    await sendMessage(chatId, notJoinedMessage);
  }
};

const handleJoinGroupCommand = async (message: any) => {
  const chatId = message.chat.id;
  const userId = message.from.id;

  const successMessage = `Congratulations! 🎊 You've successfully joined our group and verified your account.

Your participation has been recorded, and you're now an official member of our social mining community. Here's what you can expect:

• Earn points by completing tasks and engaging with our community
• Climb the leaderboard and compete with other miners
• Gain access to exclusive rewards and opportunities

Stay active, complete tasks, and watch your mining success grow! If you have any questions, feel free to ask in the group.

Happy mining! 💎`;

  await sendMessage(chatId, successMessage);

  try {
    // await updateUserJoinStatus(userId, true);
  } catch (error) {
    console.log(error);
    await sendMessage(chatId, "An error occurred while updating your information. Please try again later.");
  }
};


const checkGroupMembership = async (userId: number): Promise<boolean> => {
  
  
  const url = `${TELEGRAM_API}/getChatMember`;
  try {
    const response = await axios.post(url, {
      chat_id: GROUP_ID,
      user_id: userId,
    });
    const status = response.data.result.status;
    console.log(status);
    
    return ['creator', 'administrator', 'member'].includes(status);
  } catch (error) {
    console.error('Error checking group membership:', error);
    return false;
  }
};


export const handletelegramconnect=async (req:Request, res:Response) => {
  
    const isValid = verifyTelegramAuth(req.query);
  
    if (!isValid) {
      return res.status(403).send('Invalid Telegram authentication.');
    }
  
    
    const { id, username, first_name, last_name } = req.query;

   return  res.send({
      success: true,
      
      user: { id, username, first_name, last_name },
    });
  }

  function verifyTelegramAuth(query) {
    const { hash, ...data } = query;
  
    const secretKey = crypto
      .createHash('sha256')
      .update(BOT_TOKEN)
      .digest();
  
    const checkString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('\n');
  
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');
  
    return hmac === hash;
  }