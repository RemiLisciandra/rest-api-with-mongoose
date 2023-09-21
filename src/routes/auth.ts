import express from "express";
import {login, register} from "../controllers/auth";

export default (route: express.Router) => {
    route.post('auth/register', register);
    route.post('auth/login', login);
}