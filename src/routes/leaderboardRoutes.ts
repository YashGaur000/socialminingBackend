import { Router } from 'express';
import { getLeaderboardData } from '../controllers/leaderboardController';

const router = Router();

router.get('/', getLeaderboardData);

export default router;
