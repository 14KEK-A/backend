import { Types } from "mongoose";
export default interface ICart {
    _id: Types.ObjectId;
    count: number;
    users_id: Types.ObjectId | string;
    items: Types.ObjectId | string[];
}
