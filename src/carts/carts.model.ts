import { Schema, model } from "mongoose";
import orderDetails from "../orders/orderDetails";
import ICart from "../interfaces/icart";

const cartSchema = new Schema<ICart>(
    {
        count: Number,
        items: [orderDetails],
        users_id: {
            ref: "Users",
            type: Schema.Types.ObjectId,
        },
    },
    { versionKey: false },
);

const cartModel = model<ICart>("Carts", cartSchema);

export default cartModel;
