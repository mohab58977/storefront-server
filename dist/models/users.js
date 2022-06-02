"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_SECRET;
const rounds = process.env.SALT_ROUND;
class UserStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT user_id,firstname,lastname from users';
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
            const sql = 'delete from users WHERE user_id=$1 returning *;';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async update(id, u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE users SET firstname=$1, lastname=$2, password=$3 where user_id = $4 returning user_id,firstname,lastname; ';
            const hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(rounds));
            const result = await conn.query(sql, [u.firstname, u.lastname, hash, id]);
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
        const sql = 'Select * from users where firstname=$1 AND lastname=$2';
        const result = await conn.query(sql, [u.firstname, u.lastname]);
        if (result.rowCount) {
            const user = result.rows[0];
            return user;
        }
        return null;
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'Insert into users(firstname,lastname,password) values($1,$2,$3) returning user_id,firstname,lastname;';
            const hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(rounds));
            const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
    async read(id) {
        try {
            const sql = 'SELECT * FROM users WHERE user_id=($1)';
            const conn = await database_1.default.connect();
            const { rows } = await conn.query(sql, [id]);
            conn.release();
            return rows[0];
        }
        catch (err) {
            throw new Error(`Could not find user ${id}. ${err}`);
        }
    }
    async authenticate({ firstname, lastname, password }) {
        try {
            // if (!firstname || !lastname || !password) { return null; }
            const conn = await database_1.default.connect();
            const sql = 'Select * from users where firstname=$1 AND lastname=$2';
            const result = await conn.query(sql, [firstname, lastname]);
            conn.release();
            if (result.rowCount) {
                const user = result.rows[0];
                if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                    return user;
                }
            }
            return null;
        }
        catch (err) {
            console.log(err);
            throw new Error();
        }
    }
}
exports.UserStore = UserStore;
