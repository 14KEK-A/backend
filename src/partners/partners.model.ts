import { Schema, model } from "mongoose";
import IPartner from "../interfaces/ipartner";

const partnerSchema = new Schema<IPartner>(
    {
        name: String,
        address: String,
        email: String,
        phone_number: String,
        users_id: {
            ref: "Users",
            type: Schema.Types.ObjectId,
        },
    },
    { versionKey: false },
);

const partnerModel = model<IPartner>("Partners", partnerSchema);

export default partnerModel;
