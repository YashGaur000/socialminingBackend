import express from 'express';
import { createUser } from '../models/userModel'; 

const router = express.Router();


router.post('/test-create-user', async (req, res) => {
  const { userId, userName, userType, points, status } = req.body;

  try {
    const newUser = await createUser({ userId, userName, userType, points, status });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
});

export default router;
