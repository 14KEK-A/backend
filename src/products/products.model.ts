import IProduct from "../interfaces/iproduct";
import { Schema, model } from "mongoose";

const productSchema = new Schema<IProduct>(
    {
        name: String,
        price: Number,
        type: String,
        description: String,
        picture: String,
        count: Number,
        orders_id: [
            {
                ref: "Orders",
                type: Schema.Types.ObjectId,
            },
        ],
        carts_id: [
            {
                ref: "Carts",
                type: Schema.Types.ObjectId,
            },
        ],
    },
    { versionKey: false, timestamps: true },
);

const productModel = model<IProduct>("Products", productSchema);

export default productModel;
