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
require("dotenv/config");
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
const auth_1 = __importDefault(require("./auth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
class Perfil extends auth_1.default {
    userData({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT * from usuarios WHERE id = :id', {
                    replacements: { id: id },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    return select;
                }
                return [];
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
    userUpdate({ id, morada }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var update = yield db_1.default.query('UPDATE usuarios SET morada = :morada WHERE id = :id', {
                    replacements: { id: id, morada: morada },
                    type: sequelize_1.QueryTypes.UPDATE
                });
                if (update.length > 0 && update[1] == 1) {
                    return 1;
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    serPermision({ id, email, sms, online }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var update = yield db_1.default.query('UPDATE usuarios SET notif = :email, sms = :sms, online = :online WHERE id = :id', {
                    replacements: { id: id, email: email, sms: sms, online: online },
                    type: sequelize_1.QueryTypes.UPDATE
                });
                if (update.length > 0 && update[1] == 1) {
                    return 1;
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    recoverPasswordPerfil({ id, email, oldSenha, senha, dispositivo }) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield this.userData({ id: id });
            if (user[0].password && bcrypt_1.default.compareSync(oldSenha, user[0].password)) {
                try {
                    //Gerando Hash
                    const salt = bcrypt_1.default.genSaltSync(parseInt(process.env.SALT));
                    const hash = bcrypt_1.default.hashSync(senha, salt);
                    var update = yield db_1.default.query('UPDATE usuarios SET password = :password WHERE id = :id', {
                        replacements: {
                            id: id,
                            password: hash
                        },
                        type: sequelize_1.QueryTypes.UPDATE
                    });
                    if (update.length > 0 && update[1] == 1) {
                        return yield this.login({ email: email, password: senha, dispositivo: dispositivo });
                    }
                    return 0;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return 0;
            }
        });
    }
    uploadImage({ id, imagem }) {
        return __awaiter(this, void 0, void 0, function* () {
            var user = yield this.userData({ id: id });
            try {
                var update = yield db_1.default.query('UPDATE usuarios SET imagem = :imagem WHERE id = :id', {
                    replacements: { id: id, imagem: imagem },
                    type: sequelize_1.QueryTypes.UPDATE
                });
                if (update.length > 0 && update[1] == 1) {
                    if (user.length > 0) {
                        if (user[0].imagem != '') {
                            fs_1.default.unlink('./public/img/perfil/' + user[0].imagem, (err) => {
                                if (err)
                                    console.log(err);
                            });
                        }
                    }
                    return [{ 'status': 1, 'filename': imagem }];
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = Perfil;
