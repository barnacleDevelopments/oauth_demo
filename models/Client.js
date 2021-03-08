import mongoose from "mongoose";
import uuid from "node-uuid";

function ClientModel() {
    const ClientSchema = mongoose.Schema({
        clientId: { type: String, default: uuid.v4(), unique: true },
        clientSecret: { type: String, default: uuid.v4(), unique: true },
        createdAt: { type: Date, dafault: Date.now },
        name: { type: String, unique: true },
        scope: { type: String },
        userId: { type: String },
        redirectUri: { type: String }

    });

    return mongoose.model("Client", ClientSchema);
}




export default new ClientModel();