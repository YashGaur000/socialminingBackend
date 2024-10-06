import { Router } from 'express';
import { getLeaderboardController } from '../controllers/leaderboardController';


const router = Router();

router.get('/', getLeaderboardController);

export default router;
