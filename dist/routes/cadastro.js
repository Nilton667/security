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
router.post('/cadastro/email', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let result = yield auth.emailConfirm({
        nome: (_a = req.body.nome) !== null && _a !== void 0 ? _a : '',
        email: (_b = req.body.email) !== null && _b !== void 0 ? _b : ''
    });
    return res.json(result);
}));
router.post('/cadastro/reenvia', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    let result = yield auth.reenviaEmail({
        nome: (_c = req.body.nome) !== null && _c !== void 0 ? _c : '',
        email: (_d = req.body.email) !== null && _d !== void 0 ? _d : '',
        keycode: (_e = req.body.keycode) !== null && _e !== void 0 ? _e : '',
    });
    return res.json(result);
}));
router.post('/cadastro/user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    let result = yield auth.cadastro({
        nome: (_f = req.body.nome) !== null && _f !== void 0 ? _f : '',
        sobrenome: (_g = req.body.sobrenome) !== null && _g !== void 0 ? _g : '',
        email: (_h = req.body.email) !== null && _h !== void 0 ? _h : '',
        nacionalidade: (_j = req.body.nacionalidade) !== null && _j !== void 0 ? _j : '',
        countrycode: (_k = req.body.countrycode) !== null && _k !== void 0 ? _k : '',
        genero: (_l = req.body.genero) !== null && _l !== void 0 ? _l : '',
        identificacao: (_m = req.body.identificacao) !== null && _m !== void 0 ? _m : '',
        telemovel: (_o = req.body.telemovel) !== null && _o !== void 0 ? _o : '',
        morada: (_p = req.body.morada) !== null && _p !== void 0 ? _p : '',
        zipcode: (_q = req.body.zipcode) !== null && _q !== void 0 ? _q : '',
        password: (_r = req.body.password) !== null && _r !== void 0 ? _r : '',
        dispositivo: (_s = req.body.dispositivo) !== null && _s !== void 0 ? _s : '',
    });
    return res.json(result);
}));
exports.default = router;
