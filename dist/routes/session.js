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
const session_1 = __importDefault(require("../class/session"));
const session = new session_1.default();
router.post('/session', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let result = yield session.getData({
        id: req.body.id,
        limite: (_a = req.body.limite) !== null && _a !== void 0 ? _a : '',
    });
    return res.json(result);
}));
router.post('/session/delete', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield session.delete({
        id: req.body.sessionId,
    });
    return res.json(result);
}));
exports.default = router;
