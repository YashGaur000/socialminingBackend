
import express, { Request, Response, NextFunction } from 'express';
import { createDiscordUserSignIn, createUser, generateReferralCode, getUserDetails } from '../controllers/userController';
import { handleCallback } from '../controllers/OuthtwitterController';
import authMiddleware from '../middlewares/authMiddleware';


const router = express.Router();

// Route for login
router.get('/login', (req: Request, res: Response) => {
  createUser(req, res);
});

// Route for OAuth callback
router.get('/callback', (req: Request, res: Response) => {
  handleCallback(req, res);
});

// Protected route for user details
router.get('/user-details', (req: Request, res: Response, next: NextFunction) => {
  return authMiddleware(req, res, next);
}, (req: Request, res: Response) => {
  getUserDetails(req, res);
});



router.post('/connect-discord', authMiddleware, createDiscordUserSignIn);


router.post('/referral', authMiddleware, generateReferralCode);






export default router;
