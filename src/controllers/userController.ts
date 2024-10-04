import { Request, Response } from 'express';
import { UserModel, findUserByUserId } from '../models/userModel';
import dotenv from 'dotenv';
import { Cookie } from 'express-session';
interface sessionData {
    cookie:Cookie;
}
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
    // Authorization URL generation logic...
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure req.user is defined before accessing 
          
        if (!req.user || !req.user.userId.toString()) {
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
            data: user
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
};
