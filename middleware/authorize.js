import OAuthError from "../classes/0AuthError.js";
import handleError from "../handlers/error_handler.js";
import Token from "../models/Token.js";

const authorize = (req, res, next) => {
    let accessToken;

    // check the authorixation header
    if (req.headers.authorization) {
        // validate the authorization header
        const parts = req.headers.authorization.split("");
        if (parts.length < 2) {
            // no access token got provided - cancel *
            res.set("WWW-Authenticate", "Bearer");
            res.sendStatus("401")
            return
        }

        accessToken = parts[1];

    } else {
        // access token URI query parameter or entity body
        accessToken = req.query.access_token || req.body.access_token
    }

    if (!accessToken) {
        // no access token got provided - cancel with a 401
    }

    Token.findOne({
        accessToken: accessToken
    }, (err, token) => {
        if (err) {
            // handle error
            next(err)
        }

        if (!token) {
            // no token found - cancel
            handleError(new OAuthError("invalid_request", "Malformed or non-existing token."), res)
        }

        if (token.consumed) {
            // the token got consumed already - cancel
            handleError(new OAuthError("unauthorized_client", "Token already consumed."), res)

        }

        // consume all tokens - including the one used
        Token.update({
            userId: token.userId,
            consumed: false
        }, {
            $set: { consumed: true }
        })

        // ready to access protected ressources 
        next();
    })
}

export default authorize;