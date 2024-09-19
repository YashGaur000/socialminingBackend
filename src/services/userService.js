const User = require('../models/userModel');

exports.createUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};
