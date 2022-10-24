import { Types } from "mongoose";
export default interface IUser {
    _id: Types.ObjectId;
    role_name: string;
    role_bits: number;
    first_name: string;
    last_name: string;
    user_name: string;
    name: string;
    email: string;
    password_hash: string;
    address?: string;
    phone_number: string;
    picture_URL: string;
}
