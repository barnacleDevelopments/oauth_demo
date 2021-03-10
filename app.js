// DEPENDENCIES
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ERROR HANDLER AND ERROR CLASS
import handleError from "./handlers/error_handler.js";
import OAuthError from "./classes/0AuthError.js";

// ROUTES 
import authRoutes from "./routes/auth_routes.js";
import tokenRoutes from "./routes/token_routes.js";

// MODELS
import Client from "./models/Client.js";

// MIDDLEWARES
import authorize from "./middleware/authorize.js";

// ENVIROMENT VARIABLES
dotenv.config();
const PORT = process.env.PORT;
const ENVIROMENT = process.env.ENVIROMENT;
// EXPRESS APP
const app = express(); // express app

app.use(authRoutes); // imported auth routes
app.use(tokenRoutes); // import token routes

// CONFIG ERROR HANDLER
// development error handler - prints the stack trace
if (app.get(ENVIROMENT) === "development") {
    app.use(function (err, req, res) {
        console.log("error");
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// DATABASE 
mongoose.connect("mongodb://localhost/oauth", { useNewUrlParser: true, useUnifiedTopology: true });

// MIDDLEWARE  CONFIGURATION
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// ROUTES
app.get("/", authorize, (req, res, next) => {
    const client = new Client({
        name: 'Test',
        userId: 1,
        redirectUri: 'http://localhost:5000/callback'
    });

    client.save(err => {
        if (err) {
            next(new Error('Client exists already!'))
        } else {
            res.json(client)
        }
    });

});


app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

