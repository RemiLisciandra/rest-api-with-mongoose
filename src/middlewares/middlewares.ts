import express from "express";
import {merge, get} from 'lodash';
import {getUserBySessionToken} from "../database/user";
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { Application } from 'express';

// Error codes
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const SESSION_COOKIE_NAME = 'REMI-AUTH';

export const applyMiddlewares = (app: Application) => {
    const middlewares = [
        cors({ credentials: true }),
        compression(),
        cookieParser(),
        bodyParser.json(),
    ];

    middlewares.forEach(middleware => app.use(middleware));
};

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies[SESSION_COOKIE_NAME];

        if (!sessionToken) {
            return res.status(FORBIDDEN).send("SERVER : Incorrect session token");
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(FORBIDDEN).send("SERVER : User not found for the provided session token");
        }

        merge(req, {identity: existingUser});
        return next();
    } catch (error) {
        console.error("SERVER : Error in isAuthenticated middleware:", error);
        return res.status(BAD_REQUEST).send("SERVER : An error occurred during authentication");
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.status(BAD_REQUEST).send("SERVER : Identity missing in the request");
        }

        if (currentUserId.toString() !== id) {
            return res.status(FORBIDDEN).send("SERVER : Unauthorized access");
        }

        return next();
    } catch (error) {
        console.error("SERVER : Error in isOwner middleware:", error);
        return res.status(BAD_REQUEST).send("SERVER : An error occurred during ownership verification");
    }
}