

import { Request, Response } from 'express';
import crypto from 'crypto';
import dotenv from "dotenv"

import { findUserByUserId, UserModel } from '../models/userModel';
import SocialPlatform from '../models/SocialPlatformModel';


import axios from 'axios';
import { ISocialPlatform } from '../types/schema';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN|| '';
const BOT_INVITE = process.env.BOT_INVITE || '';
const WEBHOOK_URL=process.env.WEBHOOK_URL ;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const GROUP_ID=process.env.BOT_GROUPID;
// const linkingTokenMap: { [key: string]: string } = {};

// console.log(linkingTokenMap);


// export const generateTelegramLink = async (req: Request, res: Response) => {
 

//   try {
    
//     const { userId } = req.body;
  
     
//     const existingUser = await findUserByUserId(userId as string);
  
//     if (!existingUser) {
//        res.status(404).json({ error: 'User not found.' });
//     }
  
   
//     const telegramPlatform = existingUser.socialPlatforms.find(
//       (platform) => platform.platform === 'telegram'
//     );
  
//     if (telegramPlatform) {
//       res.status(400).json({ error: 'User already has Telegram linked.' });
//     }
  
    
//     const linkingToken = crypto.randomBytes(20).toString('hex');
  
  
//     linkingTokenMap[linkingToken] = userId;
    
//     // const telegramLink = `https://t.me/${BOT_INVITE}?start=${linkingToken}`;
  
//     const groupInviteLink = await createGroupInviteLink(linkingToken);
  
//     let telegram_link = groupInviteLink+`?start=${linkingToken}`
//     res.status(201).json({ telegram_link });
   
//   }  catch (error) {
   
//     console.error('Error generating Telegram link:', error);
//     res.status(500).json({ error: 'An error occurred while generating the Telegram link.' });
//   }
 
// };


// export const handleTelegramWebhook = async (req: Request, res: Response) => {

//   const update = req.body;
//   console.log('Received update:', JSON.stringify(update));


//   try {
//     if (update.message && update.message.new_chat_members) {
//       for (const newMember of update.message.new_chat_members) {
//         if (!newMember.is_bot) {
//           await handleNewMember(update.message.chat.id, newMember);
//         }
//       }
//     } else if (update.message && update.message.left_chat_member) {
//       if (!update.message.left_chat_member.is_bot) {
//         await handleLeftMember(update.message.chat.id, update.message.left_chat_member);
//       }
//     }

//     res.sendStatus(200);
//   } catch (error) {
//     console.error('Error handling Telegram webhook:', error);
//     res.sendStatus(500);
//   }
 

   
//   };
  
 


//   async function handleNewMember(chatId: number, newMember: any) {
//     console.log(`New member joined: ${newMember.first_name} ${newMember.last_name || ''} (ID: ${newMember.id})`);
//     const welcomeMessage = `Welcome ${newMember.first_name} to the group!`;
//     await sendTelegramMessage(chatId, welcomeMessage);
 
//   }
  
//   async function handleLeftMember(chatId: number, leftMember: any) {
//     console.log(`Member left: ${leftMember.first_name} ${leftMember.last_name || ''} (ID: ${leftMember.id})`);
    
//   }


  async function linkTelegramAccount(userId: string, telegramUser: any) {
    const user = await findUserByUserId(userId);
    if (user) {

      const telegramDetails:ISocialPlatform = {
        platform: 'telegram',
        userIdentifier: telegramUser.id.toString(),
        platformUserName: telegramUser.username,
        pointsEarned:400,
        joined:true,
        
        
      };
       user.socialPlatforms.push(telegramDetails );
      await user.save();
    } else {
      throw new Error('User not found');
    }
  }

//   async function createGroupInviteLink(linkingToken: string): Promise<string> {
//     const url = `https://api.telegram.org/bot${BOT_TOKEN}/createChatInviteLink`;
//     const body = JSON.stringify({
//       chat_id: process.env.BOT_GROUPID,
//       name: `Join request for ${linkingToken}`,
//       creates_join_request: true
//     });
  
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: body,
//       });
//       const data = await response.json();
//       console.log(data);
      
//       return data.result.invite_link;
//     } catch (error) {
//       console.error('Error creating group invite link:', error);
//       throw error;
//     }
//   }



//   async function sendTelegramMessage(chatId: number, text: string) {
//     const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
//     const body = JSON.stringify({
//       chat_id: chatId,
//       text: text,
//     });
  
//     try {
//       await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: body,
//       });
//     } catch (error) {
//       console.error('Error sending Telegram message:', error);
//     }
//   }


const userLinks = new Map();
console.log("maping",userLinks);

export const generateTelegramLink=async (req:Request, res:Response) => {
  const { userId } = req.body;
  const uniqueCode = crypto.randomBytes(6).toString('hex');
  console.log(userId,uniqueCode);
  
  try {
    const response = await axios.post(`${TELEGRAM_API}/createChatInviteLink`, {
      chat_id: GROUP_ID,
      expire_date: Math.floor(Date.now() / 1000) + 1000000000,
      name: uniqueCode
    });
    
    const inviteLink = response.data.result.invite_link;
    console.log(inviteLink);
    
    userLinks.set(uniqueCode, userId);
    
    
    res.json({ inviteLink });
  } catch (error) {
    console.error('Error generating Telegram invite link:', error);
    res.status(500).json({ error: 'Failed to generate invite link' });
  }
};

export const handleTelegramWebhook= async (req:Request, res:Response) => {
  const { message } = req.body;
  console.log("message",message);
  
  if (message.new_chat_member) {
    const uniqueCode = message.invite_link ? message.invite_link.name : null;
    const userId = uniqueCode ? userLinks.get(uniqueCode) : null;
    console.log(userId ,uniqueCode);
    
    const telegramUser={
      id:message.new_chat_member.id,
      username:""
    }
          
    // if (userId) {
    //   const telegramId = message.new_chat_member.id;
    //   await linkUserWithTelegram(userId, telegramId);
    //   await updateUserStatus(userId, 'joined');
    //   userLinks.delete(uniqueCode); // Remove used link
    // }
  } else if (message.left_chat_member) {
    // const telegramId = message.left_chat_member.id;
    // const userId = await getUserIdFromTelegramId(telegramId);
    
    // if (userId) {
    //   await updateUserStatus(userId, 'left');
    // }
  }
  
  res.sendStatus(200);
};



