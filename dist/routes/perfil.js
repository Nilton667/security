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
const perfil_1 = __importDefault(require("../class/perfil"));
const perfil = new perfil_1.default();
const upload_1 = __importDefault(require("../config/upload"));
router.post('/perfil/user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield perfil.userData({
        id: req.body.id,
    });
    return res.json(result);
}));
router.post('/perfil/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield perfil.userUpdate({
        id: req.body.id,
        morada: req.body.morada,
    });
    return res.json(result);
}));
router.post('/perfil/permision/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield perfil.serPermision({
        id: req.body.id,
        email: req.body.email,
        sms: req.body.sms,
        online: req.body.online,
    });
    return res.json(result);
}));
router.post('/perfil/update/password', upload_1.default.single('img'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield perfil.recoverPasswordPerfil({
        id: req.body.id,
        email: req.body.email,
        oldSenha: req.body.oldSenha,
        senha: req.body.senha,
        dispositivo: req.body.dispositivo
    });
    return res.json(result);
}));
router.post('/perfil/upload/image', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var id = req.body.id;
    const uploadImage = upload_1.default.single('img');
    uploadImage(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return res.json(error);
        }
        else if (req.file) {
            var result = yield perfil.uploadImage({
                id: id,
                imagem: req.file.filename,
            });
            return res.json(result);
        }
        return res.json(0);
    }));
}));
exports.default = router;
