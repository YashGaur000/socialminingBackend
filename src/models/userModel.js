const { getDatabase } = require('../config/db');

async function createUser(userData) {
  const db = await getDatabase();
  const collection = db.collection('users');
  const result = await collection.insertOne(userData);
  return result;
}

async function findUserByEmail(email) {
  const db = await getDatabase();
  const collection = db.collection('users');
  const user = await collection.findOne({ email });
  return user;
}

module.exports = {
  createUser,
  findUserByEmail,
};
