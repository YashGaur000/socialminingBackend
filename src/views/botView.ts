import TelegramBot from 'node-telegram-bot-api';

const token = '7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4';
export const bot = new TelegramBot(token, { polling: true });
