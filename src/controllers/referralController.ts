import Referral from "../models/ReferralModel";
import { v4 } from 'uuid';
import { ConnectWalletController } from "./userController";
import { UserModel } from "../models/userModel";
import { Types } from "mongoose";

export const createReferralForUser = async (userId: string) => {
  try {
    
    const user = await UserModel.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }

  
    if (user.referral) {
      throw new Error('User already has a referral');
    }

 
    const referralCode = v4(); ;

    
    const newReferrer = new Referral({
      userId,
      referralCode,
      referredUsers: [], 
      totalReferred: 0, 
      totalPointsEarned: 0, 
    });

    
    const savedReferrer=await newReferrer.save();

   
    user.referral = savedReferrer._id as Types.ObjectId;
    await user.save();

    // Generate referral link
    // const baseUrl = process.env.BASE_URL || "http://localhost:5174";
    // const referralLink = `${baseUrl}/referral?code=${referralCode}`;

    return {
      referralCode: newReferrer.referralCode,
    
    };

  } catch (error) {
    console.error('Error creating referral:', error);
    throw new Error('Unable to create referral');
  }
};

export const checkReferrer = async(referralCode: string,userId: string) => {
  try{
    console.log("refferalcode",referralCode,"usERID",userId);
    
    const referral = await Referral.findOne({referralCode: referralCode});
   console.log("referral" ,referral);
   

    if (!referral) {
      
      throw new Error('Invalid referral code');
    }

    if (!referral.referredUsers.includes(userId)) {
    
      referral.referredUsers.push(userId);
      referral.totalReferred += 1;
      referral.totalPointsEarned+=10;
      const saveReferal=await referral.save();

      console.log(`User ${userId} added to referred users successfully.`);
      return saveReferal
    } else {
      console.log(`User ${userId} has already been referred.`);

      return null;
    }
  } 

  catch (error) {
  
    console.error('Error in checkReferrer:', error);
    throw new Error(`Unable to check referral: ${error.message}`);
  }
    
 
}