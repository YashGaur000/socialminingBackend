
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
    interface SessionData extends Session {
        state?: string;         
        codeVerifier?: string;
        access_token?:string; 
    }
}

declare global {
  namespace Express {
    interface User extends IUser {

    }

    interface Request {
      user?: User;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload; 
  }
}