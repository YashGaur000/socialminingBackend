import { Request, Response } from 'express';
import { findUserByUserId } from '../models/userModel';
import dotenv from 'dotenv';
import { generateCodeChallenge, generateCodeVerifier, generateRandomState } from '../utils/OuthVerifier';

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
