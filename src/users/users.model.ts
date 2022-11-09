import { Schema, model } from "mongoose";
import IUser from "../interfaces/iuser";

const userSchema = new Schema<IUser>(
    {
        role_name: {
            type: String,
            enum: {
                values: ["user", "salesman", "admin"],
                message: "{VALUE} role is not supported!",
            },
        },
        role_bits: {
            type: Number,
            require: true,
        },
        first_name: String,
        last_name: String,
        user_name: String,
        password: String,
        address: String,
        email: String,
        phone_number: String,
        picture_URL: String,
    },
    { versionKey: false },
);

const userModel = model<IUser>("Users", userSchema);

export default userModel;
