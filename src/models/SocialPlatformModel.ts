import { Schema, model } from 'mongoose';
import { ISocialPlatform } from '../types/schema';

const socialPlatformSchema = new Schema<ISocialPlatform>({
    platform: { type: String, enum: ['twitter', 'reddit', 'telegram', 'discord'], required: true },
    userIdentifier: { type: String, required: true },
    joined: { type: Boolean, default: false },
    joinDate: { type: Date },

    pointsEarned: { type: Number, default: 0 }
  });
  
  const SocialPlatform = model<ISocialPlatform>('SocialPlatform', socialPlatformSchema);
  export default SocialPlatform;
  