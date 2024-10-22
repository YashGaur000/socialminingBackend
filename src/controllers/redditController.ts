import { Request, Response } from 'express';
import Snoowrap from 'snoowrap';

export const createRedditUserSignIn = async(req: Request, res: Response) => {
    let r;
    const {code} = req.body;
    const userAgent = process.env.USER_AGENT;
    const clientId = process.env.CLIENT_ID_REDDIT;
    const clientSecret = process.env.CLIENT_SECRET_REDDIT;
    const redirectUri = process.env.REDIRECT_URI_REDDIT; 

    console.log('reddit code',code);

    if (!code) {
        res.status(400).json({ error: 'Code is required' });
        return;
      }
    

    try {
      r = await Snoowrap.fromAuthCode({
        code,
        userAgent,
        clientId,
        clientSecret,
        redirectUri
      });
      res.redirect('/check_subscription');
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).send('Authentication failed: ' + error.message);
    }
}