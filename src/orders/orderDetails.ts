import { Schema } from "mongoose";
import IOrderDetails from "../interfaces/iorderdetails";

const orderDetails = new Schema<IOrderDetails>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
        orders_id: {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
        discount: Boolean,
        price: Number,
        quantity: Number,
        inCart: Boolean,
    },
    { versionKey: false },
);
export default orderDetails;
