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
const carregamento_1 = __importDefault(require("../class/carregamento"));
const carregamento = new carregamento_1.default();
router.post('/carregamento', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield carregamento.deposit({
        id: req.body.id,
        amount: req.body.amount,
    });
    return res.json(result);
}));
router.post('/carregamento/paypal', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield carregamento.paypal();
    return res.json(result);
}));
router.post('/carregamento/stripe', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield carregamento.stripe({
        amount: req.body.amount,
        currency: req.body.currency,
        method: req.body.method
    });
    return res.json(result);
}));
router.post('/carregamento/google', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield carregamento.google();
    return res.json(result);
}));
exports.default = router;
