"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const myLogger = function (req, res, next) {
    try {
        let decoded = jsonwebtoken_1.default.verify(req.headers.token, process.env.PRIVATE_KEY);
        req.body.id = decoded.id;
        next();
    }
    catch (error) {
        res.json('token-error');
    }
};
exports.default = myLogger;
