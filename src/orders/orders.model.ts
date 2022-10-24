import { Schema, model } from "mongoose";
import IOrder from "../interfaces/iorder";
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

const orderSchema = new Schema<IOrder>(
    {
        ship_date: {
            type: Date,
            default: Date.now,
            validate: {
                validator: function (v: Date) {
                    return this.order_date <= v;
                },
                message: "Ship date must be greater/equal than order date!",
            },
        },
        order_date: {
            type: Date,
            default: Date.now,
            required: [true, "Must have order date!"],
        },
        users_id: {
            ref: "Users",
            type: Schema.Types.ObjectId,
        },
        products: [orderDetails],
    },
    { versionKey: false },
);

const orderModel = model<IOrder>("Orders", orderSchema);

export default orderModel;
