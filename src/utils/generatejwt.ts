
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY=process.env.SECRET_KEY;

 const generatejwt = (address: string): string => {
    const wallettoken: string = jwt.sign({ address }, SECRET_KEY, { expiresIn: '5m' });
    return wallettoken;
  };

export default generatejwt;