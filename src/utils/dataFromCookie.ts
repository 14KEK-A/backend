import { Request } from "express";
import * as jwt from "jsonwebtoken";
import DataStoredInToken from "../interfaces/dataStoredInToken";

function getDataFromCookie(req: Request): string {
    const cookies = req.cookies;
    const secret = process.env.JWT_SECRET;
    const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;

    const userId = verificationResponse._id;

    return userId;
}

export default getDataFromCookie;
