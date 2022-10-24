import { Types } from "mongoose";
export default interface IRating {
    _id: Types.ObjectId;
    stars: number;
    comment: string;
    users_id: Types.ObjectId | string;
    parterns_id: Types.ObjectId | string;
    products_id: Types.ObjectId | string;
}
