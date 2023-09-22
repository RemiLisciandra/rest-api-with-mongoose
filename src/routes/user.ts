import express from "express";
import {isAuthenticated, isOwner} from "../middlewares/middlewares";
import {deleteUser, getAllUsers, updateUser} from "../controllers/user";

export default (router: express.Router) => {
    router.get('/user/', isAuthenticated, getAllUsers);
    router.delete('/user/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/user/:id', isAuthenticated, isOwner, updateUser);
}