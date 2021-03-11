// DEPENDENCIES
import express from "express";

// MODELS 
import Client from "../models/Client.js";
import AuthCode from "../models/AuthCode.js";

// ERROR HANDLER AND ERROR CLASS
import handleError from "../handlers/error_handler.js";
import OAuthError from "../classes/0AuthError.js";

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
        handleError(
            new OAuthError("unsupported_response_type", "No reponse type was provided."),
            res)
    }

    if (responseType !== "code") {
        // notify the user aboutt an unsupported response type
        handleError(
            new OAuthError("unsupported_response_type", "Invalid response type was provided."),
            res)
    }

    if (!clientId) {
        // cancel the request - client id is missing
        handleError(
            new OAuthError("unauthorized_client", "No client id was provided."),
            res)
    }

    if (!scope || scope.indexOf('openid') < 0) {
        next(new OAuthError('invalid_scope', 'Scope is missing or not well-defined'))
    }

    Client.findOne({ clientId: clientId }, (err, client) => {

        if (err) {
            // handle error by passing it to middleware
            next(err);
        }

        if (!client) {
            // cancel the request - the client does not exist
            handleError(
                new OAuthError("unauthorized_client", "The client does not exist."),
                res)
        }

        if (redirectUri !== client.redirectUri) {
            // cancel the request
            handleError(
                new OAuthError("invalid_grant", "Provided redirect URI does not match."),
                res)
        }
        // console.log(scope, client.scope)
        // if (scope !== client.scope) {
        //     // handle the scope
        //     handleError(
        //         new OAuthError("invalid_scope", "The provided scope is missing or not defined."),
        //         res)
        // }

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
                '?code=' + response.code +
                (state === undefined ? '' : '&state=' + state);
            res.redirect(redirect);
        } else {
            console.log(response)
            res.json(response)
        }
    })
});

export default router;