
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/dbconfig';
import authRoutes from './routes/authRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { setupBot } from './controllers/botController';
import TelegramBot from 'node-telegram-bot-api';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3000;
const botToken = '7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4';  
const bot = new TelegramBot(botToken, { polling: true });

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));
app.use(express.json());
app.use('/api/auth', authRoutes);  
app.use('/api/leaderboard', leaderboardRoutes);





app.use('/api/users', userRoutes);


const startServer = async () => {
  try {
    await connectToDatabase();  
    await setupBot(bot);  
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
