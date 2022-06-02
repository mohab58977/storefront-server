import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'
import { tokenToString } from 'typescript';
dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET as Secret


const auth = (
    req: Request,
    res: Response,
    next: NextFunction //resolve linter error to not use Function as a type
): void => {
    try {
        const authHead: string | undefined = req.headers.authorization;
        
        const token: string = authHead ? authHead.split(' ')[1] : '';
        const r = token.slice(1, -1);
        jwt.verify(r, tokenSecret);
        
        return next()
    }
    catch (err) {
        res.sendStatus(401)
    }
};

export default auth;
