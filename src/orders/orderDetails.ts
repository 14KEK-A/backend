<<<<<<< HEAD
import { Schema } from "mongoose";
import IOrderDetails from "../interfaces/iorderdetails";

const orderDetails = new Schema<IOrderDetails>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
        discount: Boolean,
        price: Number,
        quantity: Number,
    },
    { versionKey: false },
);

export default orderDetails;
=======
import { Schema, model } from "mongoose";
import IOrderDetails from "../interfaces/iorderdetails";

const orderDetails = new Schema<IOrderDetails>(
    {
        product_id: {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
        discount: Boolean,
        price: Number,
        quantity: Number,
    },
    { versionKey: false },
);

export default orderDetails;
>>>>>>> e515cbac68a08a29796079c148d10672a0256fa5
