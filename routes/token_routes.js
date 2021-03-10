// DEPEMDENCIES
import express from "express";

// MODELS
import AuthCode from "../models/AuthCode.js";
import Client from "../models/Client.js";
import Token from "../models/Token.js";
import RefreshToken from "../models/RefreshToken.js";

// ROUTES
const route = express.Router();


route.get("/token", (req, res, next) => {
    const grantType = req.body.grant_type;
    const refreshToken = req.body.refresh_token;
    const authCode = req.body.code;
    const redirectUri = req.body.redirect_uri;
    const clientId = req.body.client_id;

    if (!grantType) {
        // no grant type passed - cancel this request
        handleError(
            OAuthError("invalid_grant", "No grant type was provided."),
            res)
    }

    if (grantType === "authorization_code") {

    } else if (grantType === "refresh_token") {
        if (!refreshToken) {
            // no refresh token provided - cancel
            handleError(
                OAuthError("invalid_grant", "No refresh token was provided."),
                res)
        }
    }

    RefreshToken.findOne({ token: refreshToken }, (err, token) => {
        if (err) {
            // handle error
            next(err);
        }

        if (!token) {
            // no refresh token found
            handleError(
                OAuthError("invalid_grant", "No refresh token found."),
                res)
        }


        if (token.consumed) {
            // refresh token got consumed already
            handleError(
                OAuthError("invalid_grant", "Refresh token was already consumed."),
                res)
        }

        // consume all previous refresh tokens
        RefreshToken.update({
            userId: token.userId,
            consumed: false
        }, {
            $set: { consumed: true }
        })

        const _refreshToken = new RefreshToken({
            userId: token.userId
        })

        _refreshToken.save();


        const _token = new Token({
            refreshToken: _refreshToken.token,
            userId: token.userId
        })

        _token.save();

        const response = {
            access_token: _token.accessToken,
            refresh_token: _token.refreshToken,
            expires_in: _token.expiresIn,
            token_type: _token.tokenType
        }

        // send the new token to the consumer
        res.json(response)

    })

    AuthCode.findOne({ code: authCode }, (err, code) => {
        if (err) {
            // handle error
            next(err);
        }

        if (!code) {
            // no valid authorization code provided - cancel 
            handleError(
                OAuthError("invalid_grant", "No valid authorization code was provided."),
                res)
        }

        if (code.consumed) {
            // the code got consumed already - cancel
            handleError(
                OAuthError("invalid_grant", "Authorization code was already consumed."),
                res)
        }

        code.consumed = true;
        code.save();

        if (code.redirectUri !== redirectUri) {
            // cancel the request
            handleError(
                OAuthError("invalid_grant", "Authorization code uri does not match."),
                res)
        }

        // validate client - an extra security measure 
        Client.findOne({ clientId: clientId }, (err, client) => {
            if (err) {
                // the client id provided was a mismatch or does not exist
                handleError(
                    OAuthError("unauthorized_client", "The client id provided was a mismatch or does not exist."),
                    res)
            }

            if (!client) {
                // the client id provided was a mismatch or does not exist
                handleError(
                    OAuthError("unauthorized_client", "The client id provided was a mismatch or does not exist."),
                    res)
            }

            const _refreshToken = new RefreshToken({
                userId: code.userId
            });

            const _token = new Token({
                RefreshToken: _refreshToken.token,
                userId: code.userId
            });

            token.save()

            // send the new token to the consumer
            const response = {
                access_token: _token.accessToken,
                refresh_token: _token.refreshToken,
                expires_in: _token.expiresIn,
                token_type: _token.tokenType
            }
            res.json(response);
        });
    });
});

export default route;