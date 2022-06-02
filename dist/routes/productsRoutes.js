"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("../middleware/auth"));
const productHandlers = (app) => {
    app.get('/Products', getAllProducts);
    app.post('/Products', auth_1.default, createProduct);
    app.get('/Products/:id', showProduct);
    app.delete('/Products/:id', deleteProduct);
};
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
//mimic database, this will reset when we reset the server
let productStore = new products_1.ProductStore();
//get all products
const getAllProducts = async (_req, res) => {
    try {
        const products = await productStore.index();
        res.json(products);
    }
    catch (err) {
        res.sendStatus(500);
    }
};
const createProduct = async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    if (name && typeof name === 'string' && price && typeof price === 'string') {
        try {
            const product = {
                name,
                price,
            };
            const checkcreate = await productStore.checkcreate(product);
            if (checkcreate !== null) {
                res.send('product already exists');
            }
            else {
                const newproduct = await productStore.create(product);
                res.json(newproduct);
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
const showProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const product = await productStore.show(id);
            if (product) {
                res.json(product);
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
const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const deleted = await productStore.delete(id);
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
exports.default = productHandlers;
