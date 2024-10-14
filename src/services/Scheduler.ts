
import cron from 'node-cron';
import { updateLeaderboard } from '../controllers/leaderboardController';
export const scheduleLeaderboardUpdate = () => {
    cron.schedule('* * * * *', async () => {
      console.log('Running scheduled leaderboard update');
      await updateLeaderboard();
    });
  };

  