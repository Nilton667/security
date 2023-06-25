"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
let configOptions = {
    host: 'mail.construvision.ao',
    port: 465,
    secure: true,
    secureConnection: true,
    auth: {
        user: 'geral@construvision.ao',
        pass: 'nnTTvision2022!',
    },
    tls: {
        rejectUnauthorized: false
    }
};
let transporter = nodemailer_1.default.createTransport(configOptions);
exports.default = transporter;
