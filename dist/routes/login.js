"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const auth_1 = __importDefault(require("../class/auth"));
const auth = new auth_1.default();
router.post('/login/email', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield auth.loginEmail({
        email: req.body.email
    });
    return res.json(result);
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let result = yield auth.login({
        email: (_a = req.body.email) !== null && _a !== void 0 ? _a : '',
        password: (_b = req.body.password) !== null && _b !== void 0 ? _b : '',
        dispositivo: (_c = req.body.dispositivo) !== null && _c !== void 0 ? _c : '',
    });
    return res.json(result);
}));
exports.default = router;
