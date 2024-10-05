import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  userId: string;
  userName: string;
}


interface User {
  userId: number;
  userName: string;
}


interface AuthenticatedRequest extends Request {
  user?: User; 
}


const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
   
    req.user = {
      userId: parseInt(decoded.userId, 10), 
      userName: decoded.userName,
    };
    next(); 
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
