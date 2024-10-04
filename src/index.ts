
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/dbconfig';
import authRoutes from './routes/authRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { setupBot } from './controllers/botController';
import TelegramBot from 'node-telegram-bot-api';
import userRoutes from './routes/userRoutes';
import sessionMiddleware, { Cookie } from 'express-session';
const app = express();
const port = 3000;
const botToken = '7455825728:AAEI78YhN9gxh3t3wgSuA2E0f5FRoTL-T-4';  
const bot = new TelegramBot(botToken, { polling: true });
interface sessionData {
  cookie:Cookie;
}
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());


 app.use(sessionMiddleware({
  secret: 'efeefffrrre333332',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

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
function cookieParser(): any {
  throw new Error('Function not implemented.');
}

function session(arg0: { secret: string; resave: boolean; saveUninitialized: boolean; }): any {
  throw new Error('Function not implemented.');
}

