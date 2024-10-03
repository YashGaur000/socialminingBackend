import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

export const getLeaderboardData = async (req: Request, res: Response) => {
  try {
    
    const leaderboard = await UserModel.find().sort({ points: -1 }).limit(10);
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
