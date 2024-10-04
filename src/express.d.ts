
import { Request } from 'express';
import 'express-session';
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        userName: string;
      };
    }
  }
}



declare module 'express-session' {
    interface SessionData {
        state?: string;         
        codeVerifier?: string;
        access_token?:string; 
    }
}