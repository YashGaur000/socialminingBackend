
import express, { Request, Response, NextFunction } from 'express';
import { ConnectWalletController,createDiscordUserSignIn, createUser, getUserDetails, logout } from '../controllers/userController';

import { handleCallback } from '../controllers/OuthtwitterController';
import authMiddleware from '../middlewares/authMiddleware';
import { handletelegramconnect } from '../controllers/telegramController';
import { getReferedData } from '../controllers/referralController';
import { createRedditUserSignIn } from '../controllers/redditController';



const router = express.Router();

// Route for login
router.post('/login', (req: Request, res: Response) => {
  createUser(req, res);
});

// Route for OAuth callback
router.get('/callback', (req: Request, res: Response) => {
  handleCallback(req, res);
});

router.post('/connectwallet',(req:Request,res:Response)=>{
  ConnectWalletController(req,res);
});

router.get('/logout',logout);

// Protected route for user details
router.get('/user-details', (req: Request, res: Response, next: NextFunction) => {
  return authMiddleware(req, res, next);
}, (req: Request, res: Response) => {
  getUserDetails(req, res);
});



router.post('/connect-discord', createDiscordUserSignIn);
router.post('/connect/telegram',(req: Request, res: Response) => {
  handletelegramconnect(req, res);
})
router.post('/connect-reddit', createRedditUserSignIn);


// router.post('/referral', authMiddleware, generateReferralCode);


router.post('/getrefered',(req:Request,res:Response)=>{
  getReferedData
});




export default router;
