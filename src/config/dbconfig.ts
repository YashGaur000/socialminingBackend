import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

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
