import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/dbconfig';

import leaderboardRoutes from './routes/leaderboardRoutes';


import userRoutes from './routes/userRoutes';
import session from 'express-session'; 
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';

import helmet from 'helmet';
import { scheduleLeaderboardUpdate } from './services/Scheduler';
import {  generateTelegramLink, handleTelegramWebhook} from './controllers/telegramController';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
const botToken = process.env.BOT_TOKEN || ''; 
app.use(helmet());
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
}));
// interface sessionData {
//   cookie: Cookie;
// }




app.use(cors({
  origin: process.env.BASE_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
 
}));


app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send({ message: 'Something went wrong!' });
// });
scheduleLeaderboardUpdate();

app.post('/generate-telegram-link', generateTelegramLink);


app.post('/webhook', handleTelegramWebhook);



const startServer = async () => {
  try {
    await connectToDatabase(); 
       
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();










