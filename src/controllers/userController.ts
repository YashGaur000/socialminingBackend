import { Request, Response } from 'express';
import { findUserByUserId, findWalletAddress, UserModel } from '../models/userModel';
import dotenv from 'dotenv';
import { generateCodeChallenge, generateCodeVerifier, generateRandomState } from '../utils/OuthVerifier';

import { isAddress} from 'ethers';
import session from 'express-session';

dotenv.config();
const SECRET_KEY=process.env.JWT_SECRET as string;
console.log(SECRET_KEY);
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store codeVerifier and state in the session
    req.session.codeVerifier = codeVerifier;
    const state = generateRandomState();
    req.session.state = state;

    const authorizationUrl = `${AUTHORIZATION_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

     res.redirect(authorizationUrl);
   // res.json({ authorizationUrl });
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    res.status(500).json({ error: 'Failed to generate Twitter login URL' });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user && !req.user.userId) {
      res.status(401).json({ message: 'Unauthorized access' });
      return;
    }

    const user = await findUserByUserId(req.user.userId.toString());

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      status: '201',
      message: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};




export const logout = (req: Request, res: Response): void => {
   
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ message: 'Server error while logging out' });
            return;
        }

     
        res.clearCookie('token'); 
        res.clearCookie('connect.sid'); 

      
        res.status(200).json({ message: 'Logout successful' });
    });
};


export const ConnectWalletController = async(req: Request, res: Response) => {
  try {
    const { address } = req.body;

 

   
    const isValid = isAddress(address);


    if (!isValid) {
       res.status(400).json({ message: 'Invalid wallet address' });
    }

    
   
      const user = await findWalletAddress(address);;
 
   
    if (!user) {
     const newuser = new UserModel({
        userId: "",
        userName: '', 
        userType: 'wallet', 
        status: 'active',
        name: '',
        walletAddress: address,
      });
      await newuser.save();
      console.log('New user created:', newuser);
    } else {
      console.log('User already exists:', user);
    }

    req.session.walletAddress = address;
    



     res.status(200).json({ message: 'Wallet connected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};