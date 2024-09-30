const { request } = require('undici');
const userModel = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
   
    const { name, email, password,userId } = req.body;
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
      name,
      email,
      password, 
      userId // You should hash the password before saving
    };

    const result = await userModel.createUser(newUser);
    res.status(201).json({ message: 'User created successfully', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createDiscordUserSignIn = async(req, res) => {
  const { code } = req.body;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: process.env.clientId,
					client_secret: process.env.clientSecret,	
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${process.env.FRONTEND_PORT}`,
					scope: 'identify'
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();
			console.log('---------------------------------',oauthData);
			const userResult = await request('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			const userResultData = await userResult.body.json();
			console.log('-----------------------------------',userResultData);

			const DiscordUserData = {
				id: userResultData.id,
				username: userResultData.username,
				discriminator: userResultData.discriminator,
				avatar: userResultData.avatar,
				public_flags: userResultData.public_flags,
				flags: userResultData.flags,
				banner: userResultData.banner,
				accent_color: userResultData.accent_color,
				global_name: userResultData.global_name,
				avatar_decoration_data: userResultData.avatar_decoration,
				banner_color: userResultData.banner_color,
				clan: userResultData.clan,
				mfa_enabled: userResultData.mfa_enabled,
				locale: userResultData.locale,
				premium_type: userResultData.premium_type,
				email: userResultData.email,
				verified: userResultData.verified,
				accessToken: oauthData.access_token,
				refreshToken: oauthData.refresh_token,
				tokenType: oauthData.token_type,
				expiresIn: oauthData.expires_in,
				scope: oauthData.scope,
			  };
			  console.log("discorduserdata *******", DiscordUserData);

			  const result = await userModel.createDiscordUser(DiscordUserData);
			  console.log(result)
			  res.status(201).json({message: 'User created successfully', data: userResultData.id});

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		} 
	}
};

exports.generateReferralCode = async(req, res) =>{
	try{
		const {discordId} = req.query;
		console.log(req.query);
		const discordEmail = await userModel.findOne({id: discordId});
		console.log("discord email--->",discordEmail);

	}catch(error){

	};
};

