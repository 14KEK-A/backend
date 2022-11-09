import { Request } from "express";
import User from "../interfaces/iuser";

export default interface RequestWithUser extends Request {
    user: User;
}
