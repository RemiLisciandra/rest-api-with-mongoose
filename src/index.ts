import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Set up env variables
dotenv.config();

// Create app
const app = express();

// Set up middlewares
const middlewares = [
    cors({credentials: true}),
    compression(),
    cookieParser(),
    bodyParser.json()
];
middlewares.forEach(middleware => app.use(middleware));

// Server config
const server = http.createServer(app);
server.listen(8080, () => {
    console.log('Server running');
});

// Database config
const MONGO_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

async function initializeDatabase(): Promise<void> {
    mongoose.connection.on('connected', () => {
        console.log('Successfully connected to MongoDB.');
    });
    mongoose.connection.on('error', error => {
        console.error("Mongoose connection error:", error);
    });
    await mongoose.connect(MONGO_URL);
}

// Call the function to establish the connection
initializeDatabase().catch(error => {
    console.error("Failed to initialize MongoDB database" + error)
});