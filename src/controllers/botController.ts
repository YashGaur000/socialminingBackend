import TelegramBot from 'node-telegram-bot-api';
import { handleNewMemberJoin, handleMemberLeave } from '../services/telegramService';

export const setupBot = async (bot: TelegramBot) => {
  
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    
    if (msg.new_chat_members) {
      for (const member of msg.new_chat_members) {
        await handleNewMemberJoin(member, chatId, bot);
      }
    }

    
    if (msg.left_chat_member) {
      await handleMemberLeave(msg.left_chat_member, chatId, bot);
    }
  });
};
