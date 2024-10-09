import { Document, Types } from 'mongoose';


export interface ISocialPlatform {
  platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
  userIdentifier: string;
  joined: boolean;
  joinDate?: Date;
  pointsEarned: number;
}


export interface ITask {
  taskId: string;
  taskName: string;
  completed: boolean;
  completedDate?: Date;
  platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
}


export interface userModelProps extends Document {
  userId: string;
  userName: string;
  userType: string;
  points: number;
  walletAddress?: string;
  socialPlatforms: ISocialPlatform[];
  totalTasksCompleted: number;
  referredBy: Types.ObjectId | null;
  referral: Types.ObjectId | null;
  createdAt: Date;
}


export interface ILeaderboard extends Document {
  userId: Types.ObjectId;
  userName:string;
  rank: number;
  points: number;
}


export interface ITaskCompletion extends Document {
  userId: Types.ObjectId;
  taskId: string;
  completedDate: Date;
}

export interface IReferral extends Document {
  userId: string; 
  referralCode: string;
  referredUsers: string[]; 
  totalReferred: number;
  totalPointsEarned: number;
  createdAt: Date;
}