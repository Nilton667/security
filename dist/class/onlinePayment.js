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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Online {
    getData({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var query = "SELECT * from online WHERE id_usuario = :id ORDER BY id DESC LIMIT 10";
                var select = yield db_1.default.query(query, {
                    replacements: { id: id },
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
    add({ id, nome, senha }) {
        return __awaiter(this, void 0, void 0, function* () {
            var select = yield db_1.default.query('SELECT id from online WHERE id_usuario = :id', {
                replacements: { id: id },
                type: sequelize_1.QueryTypes.SELECT
            });
            if (select.length <= 5) {
                const chave = jsonwebtoken_1.default.sign({ id: id }, senha, { expiresIn: '365days' });
                try {
                    var query = "INSERT INTO online (id_usuario, nome, chave, senha) VALUES (:id, :nome, :chave, :senha)";
                    var insert = yield db_1.default.query(query, {
                        replacements: {
                            id: id,
                            nome: nome,
                            chave: chave,
                            senha: senha
                        },
                        type: sequelize_1.QueryTypes.INSERT
                    });
                    if (insert.length > 0 && insert[1] == 1) {
                        return 1;
                    }
                    return 0;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return 6;
            }
        });
    }
    delete({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var query = "DELETE FROM online WHERE id = :id";
                yield db_1.default.query(query, {
                    replacements: { id: id },
                    type: sequelize_1.QueryTypes.DELETE
                });
                return 1;
            }
            catch (error) {
                return 0;
            }
        });
    }
}
exports.default = Online;
