import mongoose from "mongoose";
import uuid from "node-uuid";

function RefreshTokenModel() {
    const RefreshTokenSchema = mongoose.Schema({
        userId: { type: String },
        token: { type: String, default: uuid.v4() },
        createdAt: { type: Date },
        consumed: { type: Boolean, default: false },
    });

    return mongoose.model("RefreshToken", RefreshTokenSchema);
}

export default new RefreshTokenModel();