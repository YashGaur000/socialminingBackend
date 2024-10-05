
import express, { Request, Response, NextFunction } from 'express';
import { createUser, getUserDetails } from '../controllers/userController';
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





// router.post('/test-create-user', async (req, res) => {
//   const { userId, userName, userType, points, status } = req.body;

//   try {
//     const newUser = await createUser({ userId, userName, userType, points, status });
//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: 'Error creating user', error: error.message });
//     } else {
//       res.status(500).json({ message: 'Unknown error occurred' });
//     }
//   }
// });

export default router;
