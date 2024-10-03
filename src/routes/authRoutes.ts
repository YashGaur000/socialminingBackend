import { Router } from 'express';
import { initiateTelegramAuth, completeTelegramAuth } from '../controllers/authController';

const router = Router();

router.get('/telegram/start', initiateTelegramAuth);  
router.get('/telegram/callback', completeTelegramAuth);  

export default router;
