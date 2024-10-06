import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

export const getLeaderboardController = async (req: Request, res: Response) => {
  try {
    const leaderboard = await  UserModel.aggregate([
      {
        $project: {
          walletAddress: 1,
          twitterHandle: 1,
          userName: 1,
          totalPoints: {
            $add: [
              "$points", 
              { $sum: "$socialPlatforms.pointsEarned" },
              { $sum: "$tasksCompleted.completed ? 10 : 0" }
            ]
          }
        }
      },
      {
        $sort: { totalPoints: -1 } 
      },
     
    ]);

 
    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};