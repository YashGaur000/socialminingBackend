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

export const checkReferrer = async(referralCode: string,userId: string) => {
  try{
    const referral = await Referral.findOne({referralCode: referralCode}).populate('userId');



    if(!referral.referredUsers.includes(userId)){

      referral.referredUsers.push(userId);

      await referral.save();

      // console.log(" userid of referrrer", newUserId)
      // console.log(" referred user data added to referral", newUserId)
    }else{
      console.log("User already referred")
    }
  }
  catch(error){
    throw new Error(error)

    console.log(error)
  }
}