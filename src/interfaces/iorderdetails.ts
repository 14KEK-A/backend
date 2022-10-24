import { Types } from "mongoose";
export default interface IOrderDetails {
    _id: Types.ObjectId;
    product_id: Types.ObjectId;
    discount: boolean;
    price: number;
    quantity: number;
}
