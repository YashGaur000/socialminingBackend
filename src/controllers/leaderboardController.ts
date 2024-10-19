import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { LeaderboardModel } from '../models/LeaderBoardModel';
import Referral from '../models/ReferralModel';

export const updateLeaderboard = async () => {
  try {
    const users = await UserModel.aggregate([
      {
        $lookup: {
          from: 'referrals',
          localField: 'userId',
          foreignField: 'userId',
          as: 'referralData'
        }
      },
      {
        $lookup: {
          from: 'socialplatforms', 
          localField: 'socialPlatforms',
          foreignField: '_id',
          as: 'platformData'
        }
      },
      {
        $project: {
          userId: '$_id',
          userName: '$userName',
          points: {
            $add: [
              
              {
                $ifNull: [{ $sum: '$platformData.pointsEarned' }, 0]
              },
              { $multiply: ['$totalTasksCompleted', 10] },
              {
                $ifNull: [
                  { $sum: '$referralData.totalPointsEarned' },
                  0
                ]
              }
            ]
          }
        }
      },
      { $sort: { points: -1 } }
    ]);
    

    const sortedData = users.map((user, index) => ({
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

    await LeaderboardModel.bulkWrite(sortedData);
    

    const userUpdates = users.map(user => ({
      updateOne: {
        filter: { _id: user.userId },
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
