import mongoose, { Model, Schema } from "mongoose";
import { ILeaderboard } from "src/types/schema";

const LeaderboardSchema: Schema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    userName:{
      type:String,
    },
    rank: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      required: true
    }
  }, {
    timestamps: true 
  });
  

  LeaderboardSchema.index({ rank: 1 });
  
  
  export const LeaderboardModel: Model<ILeaderboard> = mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);