"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, TEST_HOST, TEST_DB, TEST_USER, TEST_PASSWORD, NODE_ENV } = process.env;
let client;
if (NODE_ENV == 'dev') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
    });
}
else {
    client = new pg_1.Pool({
        host: TEST_HOST,
        database: TEST_DB,
        user: TEST_USER,
        password: TEST_PASSWORD,
    });
}
exports.default = client;
