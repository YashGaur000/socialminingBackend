
import express, { Request, Response, NextFunction } from 'express';
import { ConnectWalletController,createDiscordUserSignIn, createUser, generateReferralCode, getUserDetails, logout } from '../controllers/userController';

import { handleCallback } from '../controllers/OuthtwitterController';
import authMiddleware from '../middlewares/authMiddleware';



const router = express.Router();

// Route for login
router.post('/login', (req: Request, res: Response) => {
  createUser(req, res);
});

// Route for OAuth callback
router.get('/callback', (req: Request, res: Response) => {
  handleCallback(req, res);
});

router.post('/connectwallet',ConnectWalletController);
router.get('/logout',logout);

// Protected route for user details
router.get('/user-details', (req: Request, res: Response, next: NextFunction) => {
  return authMiddleware(req, res, next);
}, (req: Request, res: Response) => {
  getUserDetails(req, res);
});



router.post('/connect-discord', createDiscordUserSignIn);


router.post('/referral', authMiddleware, generateReferralCode);






export default router;
