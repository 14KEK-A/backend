import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthTokenMissing";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthToken";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser";
import userModel from "../users/users.model";

export default async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                req.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}
