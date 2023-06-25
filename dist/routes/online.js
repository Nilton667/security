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
const onlinePayment_1 = __importDefault(require("../class/onlinePayment"));
const online = new onlinePayment_1.default();
router.post('/online/data', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield online.getData({
        id: req.body.id,
    });
    return res.json(result);
}));
router.post('/online/add', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield online.add({
        id: req.body.id,
        nome: req.body.nome,
        senha: req.body.senha
    });
    return res.json(result);
}));
router.post('/online/delete', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield online.delete({
        id: req.body.ref,
    });
    return res.json(result);
}));
exports.default = router;
