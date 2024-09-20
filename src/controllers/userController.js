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
