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
class Historico {
    add({ id, nome, email, mensagem }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var query = "INSERT INTO feedback (id_usuario, nome, email, mensagem) VALUES (:id, :nome, :email, :mensagem)";
                var insert = yield db_1.default.query(query, {
                    replacements: { id: id, nome: nome, email: email, mensagem: mensagem },
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
        });
    }
}
exports.default = Historico;
