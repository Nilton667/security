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
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemail_1 = __importDefault(require("../config/nodemail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Auth {
    loginEmail({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT id from usuarios WHERE email = :email', {
                    replacements: { email: email },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    return select;
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    login({ email, password, dispositivo }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT * from usuarios WHERE email = :email', {
                    replacements: { email: email },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    if (bcrypt_1.default.compareSync(password, select[0].password)) {
                        const token = jsonwebtoken_1.default.sign({ id: select[0].id }, process.env.PRIVATE_KEY, { expiresIn: '24h' });
                        return yield this.saveLogin({ id: select[0].id, token: token, tempo: 1, dispositivo: dispositivo, userData: select });
                    }
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    saveLogin({ id, token, tempo, dispositivo, userData }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var insert = yield db_1.default.query('INSERT INTO acesso (id_usuario, token, tempo, dispositivo) VALUES (:id, :token, :tempo, :dispositivo)', {
                    replacements: {
                        id: id,
                        token: token,
                        tempo: tempo,
                        dispositivo: dispositivo,
                    },
                    type: sequelize_1.QueryTypes.INSERT
                });
                if (insert.length > 0 && insert[1] == 1) {
                    return [userData[0], { token: token }];
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    emailConfirm({ nome, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT id from usuarios WHERE email = :email', {
                    replacements: { email: email },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    return 2;
                }
                else {
                    let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                    try {
                        yield nodemail_1.default.sendMail({
                            from: '"Horizon" <geral@construvision.com>',
                            to: email,
                            subject: "HorizonPay",
                            text: 'Olá Sr(a) ' + nome + ', este é o seu código de verificação Horizon ' + keycode + '.',
                        });
                    }
                    catch (error) {
                        return 'mail-error';
                    }
                    return [1, keycode];
                }
            }
            catch (error) {
                return error;
            }
        });
    }
    //Reenviar email de confirmação
    reenviaEmail({ nome, email, keycode }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield nodemail_1.default.sendMail({
                    from: '"Horizon" <geral@construvision.com>',
                    to: email,
                    subject: "HorizonPay",
                    text: 'Olá Sr(a) ' + nome + ', este é o seu código de verificação Horizon ' + keycode + '.',
                });
            }
            catch (error) {
                return 'mail-error';
            }
            return 1;
        });
    }
    cadastro({ nome, sobrenome, email, nacionalidade, countrycode, genero, identificacao, telemovel, morada, zipcode, password, dispositivo }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT id from usuarios WHERE email = :email', {
                    replacements: { email: email },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    return 2;
                }
                else {
                    //Gerando Hash
                    const salt = bcrypt_1.default.genSaltSync(parseInt(process.env.SALT));
                    const hash = bcrypt_1.default.hashSync(password, salt);
                    var insert = yield db_1.default.query('INSERT INTO usuarios (nome, sobrenome, email, nacionalidade, countrycode, genero, identificacao, telemovel, morada, zipcode, password) VALUES (:nome, :sobrenome, :email, :nacionalidade, :countrycode, :genero, :identificacao, :telemovel, :morada, :zipcode, :password)', {
                        replacements: {
                            nome: nome,
                            sobrenome: sobrenome,
                            email: email,
                            nacionalidade: nacionalidade,
                            countrycode: countrycode,
                            genero: genero,
                            identificacao: identificacao,
                            telemovel: telemovel,
                            morada: morada,
                            zipcode: zipcode,
                            password: hash,
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                    if (insert.length > 0 && insert[1] == 1) {
                        return yield this.login({ email: email, password: password, dispositivo: dispositivo });
                    }
                    return 0;
                }
            }
            catch (error) {
                return error;
            }
        });
    }
    /*cardGenerator(){
        const date = new Date();
        const card0 = '6'+Math.ceil(Math.random() * (999 - 100) + 100);
        const card1 = date.getFullYear().toString().substring(2)+(date.getMonth()+1).toString().padStart(2, '0');
        const card2 = date.getDate().toString().padStart(2, '0')+date.getHours().toString().padStart(2, '0');
        const card3 = date.getMinutes().toString().padStart(2, '0')+date.getSeconds().toString().padStart(2, '0');
        return card0+card1+card2+card3;
    }*/
    recoverEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var select = yield db_1.default.query('SELECT id, nome FROM usuarios WHERE email = :email', {
                    replacements: { email: email },
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (select.length > 0) {
                    let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                    const token = jsonwebtoken_1.default.sign({ id: select[0].id, keycode: keycode }, process.env.PRIVATE_KEY, { expiresIn: '1d' });
                    try {
                        yield nodemail_1.default.sendMail({
                            from: '"Horizon" <geral@construvision.com>',
                            to: email,
                            subject: "HorizonPay",
                            text: 'Olá Sr(a) ' + select[0].nome + ', este é o seu código de recuperação Horizon ' + keycode + '.',
                        });
                    }
                    catch (error) {
                        return 'mail-error';
                    }
                    return [select[0], { keycode: keycode, token: token }];
                }
                return 0;
            }
            catch (error) {
                return error;
            }
        });
    }
    recoverReenviar({ nome, email, keycode }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield nodemail_1.default.sendMail({
                    from: '"Horizon" <geral@construvision.com>',
                    to: email,
                    subject: "HorizonPay",
                    text: 'Olá Sr(a) ' + nome + ', este é o seu código de recuperação Horizon ' + keycode + '.',
                });
            }
            catch (error) {
                return 'mail-error';
            }
            return 1;
        });
    }
    recoverToken({ token, keycode }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
                if (decoded.keycode == keycode) {
                    return 1;
                }
                return 0;
            }
            catch (error) {
                return 'token-error';
            }
        });
    }
    recoverPassword({ email, password, token, keycode, dispositivo }) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gerando Hash
            const salt = bcrypt_1.default.genSaltSync(parseInt(process.env.SALT));
            const hash = bcrypt_1.default.hashSync(password, salt);
            try {
                var decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_KEY);
                if (decoded.keycode == keycode) {
                    var update = yield db_1.default.query('UPDATE usuarios SET password = :password WHERE email = :email AND id = :id', {
                        replacements: {
                            id: decoded.id,
                            email: email,
                            password: hash
                        },
                        type: sequelize_1.QueryTypes.UPDATE
                    });
                    if (update.length > 0 && update[1] == 1) {
                        return yield this.login({ email: email, password: password, dispositivo: dispositivo });
                    }
                }
                return 0;
            }
            catch (error) {
                return 'token-error';
            }
        });
    }
}
exports.default = Auth;
