import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { LeaderboardModel } from '../models/LeaderBoardModel';







export const updateLeaderboard = async () => {
  try {
    const users = await UserModel.aggregate([
      {
        $project: {
          userId: '$_id',
          userName: '$userName',
          points: {
            $add: [
              '$points',
              { $sum: '$socialPlatforms.pointsEarned' },
              { $multiply: ['$totalTasksCompleted', 10] }
            ]
          }
        }
      },
      { $sort: { points: -1 } }
    ]);

    
    const SortedData = users.map((user, index) => ({
      updateOne: {
        filter: { userId: user.userId },
        update: {
          $set: {
            rank: index + 1,
            points: user.points,
            userName: user.userName 
          }
        },
        upsert: true
      }
    }));

    await LeaderboardModel.bulkWrite(SortedData);

    const userUpdates = users.map(user => ({
      updateOne: {
        filter: { userId: user.userId },
        update: { $set: { points: user.points } }
      }
    }));

    await UserModel.bulkWrite(userUpdates);

    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

export const getLeaderboardController = async (req: Request, res: Response) => {
  try {
    const leaderboard = await LeaderboardModel.find()
      .sort({ rank: 1 })
      .limit(100)
      .populate('userId', 'userName walletAddress');

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};