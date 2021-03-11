import express from 'express';
import authorize from '../middleware/authorize';
const router = express.Router();


router.get("/userinfo", authorize, (req, res, next) => {
    // The request got authorized - share profile information
})