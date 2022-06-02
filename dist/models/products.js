"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;
class ProductStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT product_id,name,price from Products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error();
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from Products WHERE product_id=$1 returning *;';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'Insert into Products(name,price) values($1,$2) returning *;';
            const result = await conn.query(sql, [u.name, u.price]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async checkcreate(u) {
        const conn = await database_1.default.connect();
        const sql = 'Select * from Products where name=$1 AND price=$2';
        const result = await conn.query(sql, [u.name, u.price]);
        conn.release();
        if (result.rowCount) {
            const Product = result.rows[0];
            return Product;
        }
        return null;
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * from Products WHERE product_id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
}
exports.ProductStore = ProductStore;
