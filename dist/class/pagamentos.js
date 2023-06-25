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
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
const perfil_1 = __importDefault(require("./perfil"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class Pagamento extends perfil_1.default {
    destinatario({ id, destinatario }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var query = "SELECT * FROM usuarios WHERE email = :destinatario AND id != :id OR cartao = :destinatario AND id != :id LIMIT 1";
                var select = yield db_1.default.query(query, {
                    replacements: { id: id, destinatario: destinatario },
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
    send({ id, destinatario, valor, senha }) {
        return __awaiter(this, void 0, void 0, function* () {
            var _valor = parseFloat(valor);
            if (typeof _valor != 'number') {
                return 'invalid_format';
            }
            else if (_valor >= 100000.00) {
                return 'maximum_limit';
            }
            var _destinatario = yield this.destinatario({ id, destinatario });
            if (_destinatario.length > 0) {
                var remetente = yield this.userData({ id: id });
                if (remetente.length > 0) {
                    if (remetente[0].password && bcrypt_1.default.compareSync(senha, remetente[0].password)) {
                        if (remetente[0].saldo > valor) {
                            var debito = yield db_1.default.query('UPDATE usuarios SET saldo = :saldo WHERE id = :id', {
                                replacements: { id: id, saldo: (parseFloat(remetente[0].saldo) - _valor).toFixed(2) },
                                type: sequelize_1.QueryTypes.UPDATE
                            });
                            if (debito.length > 0 && debito[1] == 1) {
                                var credito = yield db_1.default.query('UPDATE usuarios SET saldo = :saldo WHERE email = :destinatario AND id != :id OR cartao = :destinatario AND id != :id', {
                                    replacements: { id: id, destinatario: destinatario, saldo: (parseFloat(_destinatario[0].saldo) + _valor).toFixed(2) },
                                    type: sequelize_1.QueryTypes.UPDATE
                                });
                                if (credito.length > 0 && credito[1] == 1) {
                                    return [{ 'status': 'success', 'balance': (parseFloat(remetente[0].saldo) - _valor).toFixed(2) }];
                                }
                                else {
                                    return 5; // não foi possivel creditar o destinatario
                                }
                            }
                            else {
                                return 4; // não foi possivel debitar o remitente
                            }
                        }
                        else {
                            return 3; // saldo insuficiente
                        }
                    }
                    else {
                        return 2; //password errada
                    }
                }
                else {
                    return 1; // remitente não encontrado
                }
            }
            else {
                return 0; // destinatario não encontrado
            }
        });
    }
}
exports.default = Pagamento;
