import mongoose from "mongoose";
import uuid from "node-uuid";

function AuthCodeModel() {
    const AuthCodeSchema = mongoose.Schema({
        code: { type: String, default: uuid.v4(), unique: true },
        createdAt: { type: Date, dafault: Date.now },
        consumed: { type: Boolean, default: false },
        clientId: { type: String, default: uuid.v4(), unique: true },
        userId: { type: String },
        redirectUri: { type: String }
    });

    return mongoose.model("AuthCode", AuthCodeSchema);
}




export default new AuthCodeModel();