import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    auth: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false}
    }
});

export const UserModel = mongoose.model('User', UserSchema);

// User methods
export const getUsers = () => UserModel.find();
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne(
    {
        'authentication.sessionToken': sessionToken
    }
);
export const createUser = (elements: Record<string, any>) =>
    new UserModel(elements).save().then((user) =>
        user.toObject());
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id});