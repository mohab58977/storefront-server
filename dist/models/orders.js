"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class OrderStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'Select * from orders;';
            const orderProductsSql = 'SELECT productid, quantity FROM orderproducts WHERE orderid=($1)';
            const orders = [];
            const { rows } = await conn.query(sql);
            for (const order of rows) {
                const { rows: orderProductRows } = await conn.query(orderProductsSql, [
                    order.id,
                ]);
                orders.push({
                    ...order,
                    orderproducts: orderProductRows,
                });
            }
            conn.release();
            return orders;
        }
        catch (err) {
            throw new Error();
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from orders WHERE id=$1 returning *;';
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
            const sql = 'INSERT INTO orders (userid, status) VALUES($1, $2) RETURNING *';
            const conn = await database_1.default.connect();
            const { rows } = await conn.query(sql, [u.userid, u.status]);
            const order = rows[0];
            const orderProductsSql = 'INSERT INTO orderproducts (orderid,userid, productid, quantity) VALUES($1, $2, $3,$4) RETURNING productid, quantity';
            const orderProducts = [];
            for (const orderproduct of u.orderproducts) {
                const { productid, quantity } = orderproduct;
                const { rows } = await conn.query(orderProductsSql, [
                    order.id,
                    u.userid,
                    productid,
                    quantity,
                ]);
                orderProducts.push(rows[0]);
            }
            conn.release();
            return {
                ...order,
                orderproducts: orderProducts,
            };
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'Select * from orders where id=$1 ;';
            const orderProductsSql = 'SELECT productid, quantity FROM orderproducts WHERE orderid=($1);';
            const { rows } = await conn.query(sql, [id]);
            const order = rows[0];
            const { rows: orderProductRows } = await conn.query(orderProductsSql, [id]);
            conn.release();
            return {
                ...order,
                orderproducts: orderProductRows,
            };
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async showforuser(userid) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'Select * from orders where userid=$1 ;';
            const orderProductsSql = 'SELECT productid, quantity FROM orderproducts WHERE userid=($1) AND orderid=($2);';
            const orders = [];
            const { rows } = await conn.query(sql, [userid]);
            for (const order of rows) {
                const { rows: orderProductRows } = await conn.query(orderProductsSql, [
                    order.userid,
                    order.id,
                ]);
                orders.push({
                    ...order,
                    orderproducts: orderProductRows
                });
            }
            conn.release();
            return orders;
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
}
exports.OrderStore = OrderStore;
