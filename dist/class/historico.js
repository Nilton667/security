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
    atividades({ id, limite }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (limite == 0) {
                    var query = "SELECT * from historico WHERE id_usuario = :id ORDER BY id DESC LIMIT 15";
                }
                else {
                    var query = "SELECT * from historico WHERE id < :limite AND id_usuario = :id ORDER BY id DESC LIMIT 15";
                }
                var select = yield db_1.default.query(query, {
                    replacements: { id: id, limite: limite },
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
}
exports.default = Historico;
