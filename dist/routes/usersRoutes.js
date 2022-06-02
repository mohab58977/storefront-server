"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../models/users");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const userHandlers = (app) => {
    app.get('/users', auth_1.default, getAllUsers);
    app.get('/users/:id', auth_1.default, showUser);
    app.put('/users/:id', auth_1.default, update);
    app.post('/users/authenticate', authenticate);
    app.post('/users', createUser);
    app.delete('/users/:id', auth_1.default, deleteUser);
};
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
//mimic database, this will reset when we reset the server
let userStore = new users_1.UserStore();
//get all users
const getAllUsers = async (_req, res) => {
    try {
        const users = await userStore.index();
        res.json(users);
    }
    catch (err) {
        res.sendStatus(500);
    }
};
const showUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(400);
            res.send('Missing required parameter :id.');
            return false;
        }
        const user = await userStore.read(id);
        res.json(user);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
};
const update = async (req, res) => {
    try {
        const id = req.params.id;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = req.body.password;
        console.log(id, firstname, lastname, password);
        if (firstname === undefined ||
            lastname === undefined ||
            password === undefined ||
            id === undefined) {
            res.status(400);
            res.send('Some required parameters are missing! eg. :firstname, :lastname, :id');
            return false;
        }
        const useritem = {
            firstname: firstname,
            lastname: lastname,
            password: password,
        };
        const updateduser = await userStore.update(id, useritem);
        const token = jsonwebtoken_1.default.sign({
            user: {
                firstname: updateduser.firstname,
                lastname: updateduser.lastname,
                id: updateduser.id,
            },
        }, tokenSecret, {
            expiresIn: '500m', // expires in 500 minutes
        });
        const usertoken = {
            ...updateduser,
            token
        };
        res.json(usertoken);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
};
const authenticate = async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    if (firstname &&
        typeof firstname === 'string' &&
        lastname &&
        typeof lastname === 'string' &&
        password &&
        typeof password === 'string') {
        try {
            const useritem = {
                firstname: firstname,
                lastname: lastname,
                password: password
            };
            const user = await userStore.authenticate(useritem);
            if (user) {
                const token = jsonwebtoken_1.default.sign({
                    user: {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        id: user.id,
                    },
                }, tokenSecret, {
                    expiresIn: '500m', // expires in 500m
                });
                res.json(token);
            }
            else {
                res.sendStatus(401);
            }
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
    else {
        res.status(400).send('bad request');
    }
};
const createUser = async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    if (firstname &&
        typeof firstname === 'string' &&
        lastname &&
        typeof lastname === 'string' &&
        password &&
        typeof password === 'string') {
        try {
            const user = {
                firstname,
                lastname,
                password,
            };
            const checkcreate = await userStore.checkcreate(user);
            if (checkcreate !== null) {
                res.send('user already exists');
            }
            else {
                const newUser = await userStore.create(user);
                const token = jsonwebtoken_1.default.sign({
                    user: {
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        id: newUser.id,
                    },
                }, tokenSecret, {
                    expiresIn: '500m', // expires in 500 minutes
                });
                const usertoken = {
                    ...newUser,
                    token
                };
                res.json(usertoken);
            }
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
    else {
        res.status(400).send('bad request');
    }
};
//delete a resouce
const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const deleted = await userStore.delete(id);
            if (deleted) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
    else {
        res.sendStatus(404);
    }
};
exports.default = userHandlers;
