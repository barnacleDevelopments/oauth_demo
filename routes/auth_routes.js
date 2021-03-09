// DEPENDENCIES
import express from "express";

// MODELS 
import Client from "../models/Client.js";
import AuthCode from "../models/AuthCode.js";


// ROUTER 
const router = express.Router();

router.get("/authorize", (req, res, next) => {
    const responseType = req.query.response_type;
    const clientId = req.query.client_id;
    const redirectUri = req.query.redirect_uri
    const scope = req.query.scope;
    const state = req.query.state;

    if (!responseType) {
        // cancel the request - response type missing
    }

    if (responseType !== "code") {
        // notify the user aboutt an unsupported response type
    }

    if (!clientId) {
        // cancle the request - client id is missing
    }

    Client.findOne({ clientId: clientId }, (err, client) => {
        if (err) {
            // handle error by passing it to middleware
            next(err);
        }

        if (!client) {
            // cancel the request - the client does not exist

        }

        if (redirectUri !== client.redirectUri) {
            // cancel the request
        }

        if (scope !== client.scope) {
            // handle the scope
        }

        const authCode = new AuthCode({
            clientId: clientId,
            userId: client.userId,
            redirectUri: redirectUri
        });

        authCode.save();
        const response = {
            state: state,
            code: authCode.code
        }


        if (redirectUri) {
            const redirect = redirectUri +
                '?code=' + response.code + (state === undefined ? '' : '&state=' + state);
            res.redirect(redirect);
        } else {
            res.json(response)
        }
    })
});

export default router;