import express from "express";
import {deleteUserById, getUsers, getUserById, updateUserById} from '../database/user';

// Error codes
const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(OK).send(users);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST).send("SERVER : Error retrieving users");
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id, username} = req.body;

        if (!id || !username) {
            return res.status(BAD_REQUEST).send("SERVER : Required fields are missing");
        }

        const updatedUser = await updateUserById(id, {username});

        if (!updatedUser) {
            return res.status(NOT_FOUND).send("SERVER : User not found");
        }

        return res.status(OK).send(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST).send("SERVER : Error updating user");
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.body;

        if (!id) {
            return res.status(BAD_REQUEST).send("SERVER : User ID is required");
        }

        const deletedUser = await deleteUserById(id);

        if (!deletedUser) {
            return res.status(NOT_FOUND).send("SERVER : User not found");
        }

        return res.status(OK).send(deletedUser);
    } catch (error) {
        console.error(error);
        return res.status(BAD_REQUEST).send("SERVER : Error deleting user");
    }
}