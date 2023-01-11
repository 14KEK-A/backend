import { Types } from "mongoose";
export default interface IProduct {
    _id: Types.ObjectId;
    name: string;
    price: number;
    type: string;
    description: string;
    picture: string;
    orders_id: (Types.ObjectId | string)[];
}
