import { Schema, model } from 'mongoose';
import { IReferral } from '../types/schema';


const referralSchema = new Schema<IReferral>({
  userId: { type: String, required: true }, 
  referralCode: { type: String, required: true }, 
  referredUsers: [{ type: String }], 
  totalReferred: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
 
});

const Referral = model<IReferral>('Referral', referralSchema);
export default Referral;


