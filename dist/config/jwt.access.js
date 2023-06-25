"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const access = (req, res, next) => {
    try {
        if (req.headers['access-key'] == process.env.ACCESS_KEY) {
            next();
        }
        else {
            res.json('access-error');
        }
    }
    catch (error) {
        res.json('access-error');
    }
};
exports.default = access;
