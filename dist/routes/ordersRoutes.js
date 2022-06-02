"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("../middleware/auth"));
const orderHandlers = (app) => {
    app.get('/orders', auth_1.default, getAllorders);
    app.post('/orders', auth_1.default, createorder);
    app.get('/orders/:id', auth_1.default, showorder);
    app.get('/orders/userorders/:userid', auth_1.default, showuserorders);
    app.delete('/orders/:id', auth_1.default, deleteorder);
};
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
//mimic database, this will reset when we reset the server
let orderStore = new orders_1.OrderStore();
//get all orders
const getAllorders = async (_req, res) => {
    try {
        const orders = await orderStore.index();
        res.json(orders);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
const createorder = async (req, res) => {
    const userid = req.body.userid;
    const orderproducts = req.body.orderproducts;
    const status = req.body.status;
    console.log(userid, orderproducts);
    console.log(orderproducts.length);
    if ((userid &&
        typeof userid === 'string' &&
        orderproducts &&
        typeof orderproducts === 'object' &&
        status &&
        typeof status === 'string' &&
        status === 'active' || 'complete')) {
        try {
            const order = {
                userid,
                orderproducts,
                status
            };
            const neworder = await orderStore.create(order);
            res.json(neworder);
        }
        catch (err) {
            res.sendStatus(500);
        }
    }
    else {
        res.status(400).send('bad request');
    }
};
const showorder = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    if (id) {
        try {
            const order = await orderStore.show(id);
            if (order) {
                res.json(order);
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
const showuserorders = async (req, res) => {
    const id = parseInt(req.params.userid);
    console.log(id);
    if (id) {
        try {
            const orders = await orderStore.showforuser(id);
            if (orders) {
                res.json(orders);
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
const deleteorder = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    if (id) {
        try {
            const deleted = await orderStore.delete(id);
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
//delete a resouce
exports.default = orderHandlers;
