import Referral from "../models/ReferralModel";
import { v4 } from 'uuid';
import { ConnectWalletController } from "./userController";
import { UserModel } from "../models/userModel";
import { Types } from "mongoose";
import { Request, Response } from "express";

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


export const getReferedData=async(req:Request,res:Response)=>{
 
  try {
    const { userId } = req.body;  

   
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

   
    const referral = await Referral.findOne({ userId }).populate('referredUsers', 'name email'); 

    if (!referral) {
      return res.status(404).json({ message: 'Referral data not found' });
    }

  
    return res.status(200).json({ referredUsers: referral.referredUsers });
  } catch (error) {
    console.error('Error fetching referred users:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}