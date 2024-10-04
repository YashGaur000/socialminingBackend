import { Request, Response } from 'express';
import { createUser, findUserByUserId, UserModel, userModelProps} from "../models/userModel";
import axios from 'axios';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import dotenv from 'dotenv';
import { Cookie } from 'express-session';
interface sessionData {
    cookie:Cookie;
}

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const TOKEN_URL = process.env.TOKEN_URL as string;
const AUTHORIZATION_URL = process.env.AUTHORIZATION_URL as string;
const USER_DETAILS_URL = process.env.USER_DETAILS_URL as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

function generateBasicAuthHeader(clientId: string, clientSecret: string): string {
    const authString = `${clientId}:${clientSecret}`;
    return `Basic ${Buffer.from(authString).toString('base64')}`;
}

const handleCallback = async (req: Request, res: Response): Promise<void> => {
    const authorizationCode = req.query.code as string | undefined;
    const stateReceived = req.query.state as string | undefined;

    if (stateReceived !== req.session.state) {
        res.status(400).send('State mismatch or CSRF attack detected');
        return;
    }

    if (!authorizationCode) {
        res.status(400).send('Authorization code not provided');
        return;
    }

    let codeVerifier = req.session.codeVerifier  ;

    if (!codeVerifier) {
        console.error('Code Verifier not found in session');
        res.status(400).send('Code verifier not found in session');
        return;
    }

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': generateBasicAuthHeader(CLIENT_ID, CLIENT_SECRET),
    };

    const body = querystring.stringify({
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
        client_id: CLIENT_ID,
    });

    try {
        const tokenResponse : {
            data: { access_token: string; };
}= await axios.post(TOKEN_URL, body, { headers });
        const { access_token } = tokenResponse.data;

        req.session.access_token = access_token;

        const userResponse = await axios.get(USER_DETAILS_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, name, userName } = userResponse.data.data;
        let success = false;

        try {
            
            const userId:string = (id);
            const existingUser = await findUserByUserId(userId);
       
            if (existingUser) {
                console.log('User already exists');
                success = true;
            } else {
                const newUser:userModelProps = {
                    userId,
                    status:"join",
                    userName,
                    userType: 'twitter',
                    points: 400,
                };
                await createUser(newUser);
                success = true;
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
            return;
        }

        if (success) {
            
            const jwtToken = jwt.sign({ userId: id, userName: userName }, JWT_SECRET, {
                expiresIn: '1h',
            });

            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });

            res.redirect('http://localhost:5173/success?status=success');
        } else {
            res.redirect('http://localhost:5173/failure');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during token exchange or fetching user details:', error.message);
            res.status(500).send('Failed to exchange authorization code or fetch user details');
        } else {
            console.error('Unknown error:', error);
            res.status(500).send('Unknown error occurred');
        }
    }
};

const protectedRoute = (req: Request, res: Response): void => {
    res.json({ message: 'You have accessed a protected route', user: req.user });
};

export { handleCallback, protectedRoute };
