const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Load MongoDB URI from environment variables

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('MongoDB connected successfully');
  }
  return client;
}

async function getDatabase(dbName) {
  const client = await connectDB();
  return client.db(dbName);
}

module.exports = { getDatabase };
