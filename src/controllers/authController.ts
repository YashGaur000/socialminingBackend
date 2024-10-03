import { Request, Response } from 'express';
import { generateAuthUrl, handleTelegramAuth } from '../services/authService';

export const initiateTelegramAuth = (req: Request, res: Response) => {
  const authUrl = generateAuthUrl();
  res.json({ url: authUrl });
};

export const completeTelegramAuth = async (req: Request, res: Response) => {
  try {
    const userData = await handleTelegramAuth(req.query);
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Authentication failed.' });
  }
};
