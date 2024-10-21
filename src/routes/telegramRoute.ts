// import { createHash, createHmac } from 'crypto';
// import express, { Request, Response } from 'express';

// const router = express.Router();

// router.post('/telegram/connect', async (req:Request, res:Response) => {
//   try {
//     const { user } = req.body;

//     // Verify Telegram data hash
//     const isValid = verifyTelegramHash(user.hash, {
//       auth_date: user.auth_date,
//       first_name: user.first_name,
//       id: user.id,
//       username: user.username,
//       photo_url: user.photo_url,
//     });

//     if (!isValid) {
//       return res.status(400).json({ error: 'Invalid Telegram data' });
//     }

//     // Save user data to the database
//     // Assuming you have a User model and a way to access the currently authenticated user
//     // Uncomment and adjust the following code according to your user model
//     /*
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id, // Use the correct way to get the authenticated user's ID
//       {
//         telegramConnected: true,
//         telegramUsername: user.username,
//         telegramId: user.id,
//       },
//       { new: true }
//     );
//     */

//     // Send the response with user data (if needed)
//     res.json({
//       success: true,
//       message: 'Telegram successfully connected',
//       user: {
//         id: user.id,
//         first_name: user.first_name,
//         username: user.username,
//         photo_url: user.photo_url,
//       },
//     });

//   } catch (error) {
//     console.error('Telegram connection error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// function verifyTelegramHash(hash, data) {
//   const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Replace with your actual bot token
//   const secretKey = createHash('sha256')
//     .update(BOT_TOKEN)
//     .digest();

//   const dataCheckString = Object.keys(data)
//     .sort()
//     .map(key => `${key}=${data[key]}`)
//     .join('\n');

//   const hmac = createHmac('sha256', secretKey)
//     .update(dataCheckString)
//     .digest('hex');

//   return hmac === hash;
// }

// export default router;
