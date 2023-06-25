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
const pagamentos_1 = __importDefault(require("../class/pagamentos"));
const pagamento = new pagamentos_1.default();
router.post('/pagamento/destinatario', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield pagamento.destinatario({
        id: req.body.id,
        destinatario: req.body.destinatario,
    });
    return res.json(result);
}));
router.post('/pagamento/send', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield pagamento.send({
        id: req.body.id,
        destinatario: req.body.destinatario,
        valor: req.body.valor,
        senha: req.body.senha,
    });
    return res.json(result);
}));
exports.default = router;
