import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/dbconfig';
import authRoutes from './routes/authRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { setupBot } from './controllers/botController';
import TelegramBot from 'node-telegram-bot-api';
import userRoutes from './routes/userRoutes';
import session, { Cookie } from 'express-session'; 
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';

import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
const botToken = '7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4'; 
// const bot = new TelegramBot(botToken, { polling: true });
app.use(helmet());
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));
interface sessionData {
  cookie: Cookie;
}


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

console.log(process.env.NODE_ENV as string);

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
 
}));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


const startServer = async () => {
  try {
    await connectToDatabase(); 
    // await setupBot(bot);       
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
