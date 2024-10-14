import Referral from "../models/ReferralModel";
import { uuid } from "uuidv4";
import { ConnectWalletController } from "./userController";

export const createReferralForUser = async(userId: string) => {
  try {
    // new referral entry for the user
    const referralCode = uuid();
    const newReferrer = new Referral({
      userId,
      referralCode
    });
    await newReferrer.save();

    // referral link
    const baseUrl = process.env.BASE_URL || "http://localhost:5174"; 
    const referralLink = `${baseUrl}/referral?code=${referralCode}`;

    return {
      referralCode: newReferrer.referralCode,
      referralLink 
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    throw new Error('Unable to create referral');
  }
};
