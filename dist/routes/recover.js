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
router.post('/recover/email', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let result = yield auth.recoverEmail((_a = req.body.email) !== null && _a !== void 0 ? _a : '');
    return res.json(result);
}));
router.post('/recover/reenvia', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    let result = yield auth.recoverReenviar({
        nome: (_b = req.body.nome) !== null && _b !== void 0 ? _b : '',
        email: (_c = req.body.email) !== null && _c !== void 0 ? _c : '',
        keycode: (_d = req.body.keycode) !== null && _d !== void 0 ? _d : '',
    });
    return res.json(result);
}));
router.post('/recover/token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    let result = yield auth.recoverToken({
        token: (_e = req.body.token) !== null && _e !== void 0 ? _e : '',
        keycode: (_f = req.body.keycode) !== null && _f !== void 0 ? _f : '',
    });
    return res.json(result);
}));
router.post('/recover/update/password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield auth.recoverPassword({
        email: req.body.email,
        password: req.body.password,
        token: req.body.token,
        keycode: req.body.keycode,
        dispositivo: req.body.dispositivo
    });
    return res.json(result);
}));
exports.default = router;
