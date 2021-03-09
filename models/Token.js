import mongoose from "mongoose";
import uuid from "node-uuid";

function TokenModel() {
    const TokenSchema = mongoose.Schema({
        userId: { type: String },
        refreshToken: { type: String, unique: true },
        accessToken: { type: String, default: uuid.v4() },
        expiresIn: { type: String, default: '10800' },
        tokenType: { type: String, default: "bearer" },
        consumed: { type: Boolean, default: false },
        createdAt: { type: Date }
    });

    return mongoose.model("Token", TokenSchema);
}




export default new TokenModel();