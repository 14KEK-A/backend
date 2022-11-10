import IRating from "../interfaces/irating";
import { Schema, model } from "mongoose";

const ratingSchema = new Schema<IRating>(
    {
        stars: Number,
        comment: String,
        users_id: {
            ref: "Users",
            type: Schema.Types.ObjectId,
        },
        parterns_id: {
            ref: "Partners",
            type: Schema.Types.ObjectId,
        },
        products_id: {
            ref: "Products",
            type: Schema.Types.ObjectId,
        },
    },
    { versionKey: false },
);

const ratingModel = model<IRating>("Ratings", ratingSchema);

export default ratingModel;
