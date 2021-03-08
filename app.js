// DEPENDENCIES
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES 
import authRoutes from "./routes/auth_routes.js";
import Client from "./models/Client.js";


// ENVIROMENT VARIABLES
dotenv.config()
const PORT = process.env.PORT;

// EXPRESS APP
const app = express(); // express app

app.use(authRoutes); // imported routes

// DATABASE 
mongoose.connect("mongodb://localhost/oauth", { useNewUrlParser: true, useUnifiedTopology: true });

// MIDDLEWARE 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// ROUTES

app.get("/", (req, res, next) => {
    const client = new Client({
        name: 'Test',
        userId: 1,
        redirectUri: 'http://localhost:5000/callback'
    })

    client.save(err => {
        if (err) {
            next(new Error('Client exists already!'))
        } else {
            res.json(client)
        }
    })

})


app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))

