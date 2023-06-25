"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
exports.default = ((0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/img/perfil');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + path_1.default.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        const permite = ['.png', '.jpg', '.jpeg'].find(formato => formato == path_1.default.extname(file.originalname.toLowerCase()));
        if (permite == undefined) {
            return cb(null, false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: (1024 * 1024) * 2
    },
}));
