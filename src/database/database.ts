import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Set up env variables
dotenv.config();

if (!process.env.MONGO_USERNAME || !process.env.MONGO_PASSWORD || !process.env.MONGO_HOST) {
    throw new Error("MONGO DB : Missing environment variables");
}

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

export async function initializeDatabase(): Promise<void> {
    mongoose.connection.on('connected', () => {
        console.log('MONGO DB : Successfully connected');
    });

    mongoose.connection.on('error', error => {
        console.error('MONGO DB : Mongoose connection error:', error);
    });

    try {
        await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.error('MONGO DB : Failed to connect:', error);
    }
}