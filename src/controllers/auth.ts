import express from "express";
import {createUser, getUserByEmail} from "../database/user";
import {auth, random} from "../helpers/helpers";

// Errors codes
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const SESSION_COOKIE_NAME = 'REMI-AUTH';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(BAD_REQUEST).send("SERVER : Email or password missing");
        }

        const user = await getUserByEmail(email).select('+auth.salt +auth.password');

        if (!user) {
            return res.status(UNAUTHORIZED).send("SERVER : User does not exist");
        }

        const expectedHash = auth(user.auth.salt, password);

        if (user.auth.password !== expectedHash) {
            return res.status(FORBIDDEN).send("SERVER : Incorrect password");
        }

        const salt = random();
        user.auth.sessionToken = auth(salt, user._id.toString());
        await user.save();

        const domain = 'localhost';
        res.cookie(SESSION_COOKIE_NAME, user.auth.sessionToken, {domain, path: '/'});

        return res.status(OK).json(user);
    } catch (error) {
        console.log(error);
        return res.status(BAD_REQUEST).send("SERVER : An error occurred");
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {username, email, password} = req.body;

        if (!email || !password || !username) {
            return res.status(BAD_REQUEST).send("SERVER : Email, password, or username missing");
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(CONFLICT).send("SERVER : User with this email already exists");
        }

        const salt = random();

        const user = createUser({
            username,
            email,
            auth: {
                salt,
                password: auth(salt, password)
            }
        });

        return res.status(CREATED).json(user);
    } catch (error) {
        console.error(error);
        return res.status(SERVER_ERROR).send("SERVER : An error occurred during registration");
    }
}
