const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.post('/register', userController.createUser);
// router.get('/registerwithdiscord', userController.createDiscordUserSignIn);
router.post('/register', userController.createDiscordUserSignIn);
router.get('/referral', userController.generateReferralCode);


module.exports = router;