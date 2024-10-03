import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();  

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/telegram_bot_logs';

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);  
  }
};

export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
};
