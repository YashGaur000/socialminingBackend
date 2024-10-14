import { Request, Response } from 'express';
import { findUserByUserId, findWalletAddress, UserModel } from '../models/userModel';

import { randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { generateCodeChallenge, generateCodeVerifier, generateRandomState } from '../utils/OuthVerifier';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';

import { isAddress, Wallet} from 'ethers';




dotenv.config();
const SECRET_KEY=process.env.JWT_SECRET as string;
console.log(SECRET_KEY);
 

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL as string;


export const generatejwtToken = (address: string): string => {
  const wallettoken: string = jwt.sign({ address }, SECRET_KEY, { expiresIn: '5m' });
  return wallettoken;
};


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {

     const {Address}=req.body;
      console.log(Address);
      
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store codeVerifier and state in the session
    req.session.codeVerifier = codeVerifier;
    const state = generateRandomState();
    req.session.state = state;
    req.session.WalletAddress=Address;

    
    const authorizationUrl = `${AUTHORIZATION_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    //  res.redirect(authorizationUrl);
   res.json({ authorizationUrl });
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
    const {userId}=req.body;
       
     
    
    const isValid = isAddress(address);
          
    

    if (!isValid) {
       res.status(400).json({ message: 'Invalid wallet address' });
    }

    const Address:string=address.toString();
   
      const user = await findWalletAddress(Address);;
  
   
    if (!user) {
     const newuser = new UserModel({
        userId: `${Date.now()}`,
        userName: `Guest${Date.now()}`, 
        userType: 'wallet', 
       
       
        walletAddress: address,
      });
      await newuser.save();
      console.log('New user created:', newuser);
    } else {
      console.log('User already exists:', user);
    }

  
    



     res.status(200).json({ message: 'Wallet connected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
interface DiscordTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }
  
  interface DiscordUserResponse {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: number | null;
    global_name: string | null;
    avatar_decoration: string | null;
    banner_color: string | null;
    mfa_enabled: boolean;
    locale: string;
    premium_type: number | null;
    email: string | null;
    verified: boolean;
  }
  
  interface DiscordUserData extends DiscordUserResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
  }
  
  export const createDiscordUserSignIn = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
  
    if (!code) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }
  
    try {
      // Fetch token data from Discord
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID as string,
          client_secret: process.env.CLIENT_SECRET as string,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:${process.env.FRONTEND_PORT}`,
          scope: 'identify',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (!tokenResponse.ok) {
        throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`);
      }
  
      const oauthData: DiscordTokenResponse = await tokenResponse.json();
      console.log('---------------oauthData------------------', oauthData);
  
      // Fetch user data from Discord
      const userResponse= await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
  
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
      }
  
      const userResultData: DiscordUserResponse = await userResponse.json();
      console.log('--------------userResultData---------------------', userResultData);
  
      // Prepare Discord user data for storage
      const DiscordUserData: DiscordUserData = {
        ...userResultData,
        accessToken: oauthData.access_token,
        refreshToken: oauthData.refresh_token,
        tokenType: oauthData.token_type,
        expiresIn: oauthData.expires_in,
        scope: oauthData.scope,
      };
      console.log('discorduserdata *-******', DiscordUserData);
  
      // Save user data to the database
      //const result = await createDiscordUser(DiscordUserData);
      //console.log('-------result-----', result);
  
      res.status(201).json({
        message: 'User created successfully',
        data: {
          id: userResultData.id,
          username: userResultData.username,
        },
      });
    } catch (error) {
      console.error('Error creating Discord user:', error);
      res.status(500).json({ error: 'Failed to create Discord user' });
    }
  };
  
  export const generateReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { discordIdAndUsername }: { discordIdAndUsername: { id: string; username: string } } = req.body;
      console.log(discordIdAndUsername);
  
            const generateReferralCode = (): string => {
            //return randomBytes(3).toString('hex');
            return randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
            };
  
      const referralCode: string = generateReferralCode();
      console.log('===referralcode===', referralCode);
  
      const discordUser = await findUserByUserId(discordIdAndUsername.id.toString()
      );
      console.log('discord email--->', discordUser);
  
      res.status(200).json({ referralCode, discordUser });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({ error: 'Failed to generate referral code' });
    }
  
  };
