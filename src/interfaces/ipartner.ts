import { Types } from "mongoose";
export default interface IPartner {
    _id: Types.ObjectId;
    name: string;
    address: string;
    email: string;
    phone_number: string;
    users_id: Types.ObjectId | string;
}
