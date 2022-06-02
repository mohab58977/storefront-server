"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const auth = (req, res, next //resolve linter error to not use Function as a type
) => {
    try {
        const authHead = req.headers.authorization;
        const token = authHead ? authHead.split(' ')[1] : '';
        let firstChar = token.charAt(0);
        let tokenr;
        firstChar === '"' ? tokenr = token.slice(1, -1) : tokenr = token;
        jsonwebtoken_1.default.verify(tokenr, tokenSecret);
        return next();
    }
    catch (err) {
        res.sendStatus(401);
    }
};
exports.default = auth;
