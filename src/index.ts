import express from 'express';
import {applyMiddlewares} from './middlewares/middlewares';
import {initializeDatabase} from './database/database';
import {createServer} from './server/server';

// Create app
const app = express();

// Apply middlewares
applyMiddlewares(app);

// Create server
createServer(app);

// Initialize Database
initializeDatabase().catch(error => {
    console.error("MONGO DB : Failed to initialize database : ", error)
});
