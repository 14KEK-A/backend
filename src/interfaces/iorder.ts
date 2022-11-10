import { Types } from "mongoose";
import IOrderDeatils from "../interfaces/iorderdetails";

export default interface IOrder {
    _id: Types.ObjectId | string;
    ship_date: Date;
    order_date: Date;
    users_id: Types.ObjectId | string;
    products: Array<IOrderDeatils>;
}
