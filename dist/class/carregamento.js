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
const perfil_1 = __importDefault(require("./perfil"));
const axios = require('axios').default;
class Carregamento extends perfil_1.default {
    deposit({ id, amount }) {
        return __awaiter(this, void 0, void 0, function* () {
            const valor = parseFloat(amount);
            if (typeof valor != 'number') {
                return 'invalid_format';
            }
            var user = yield this.userData({ id: id });
            if (user.length > 0) {
                var credito = yield db_1.default.query('UPDATE usuarios SET saldo = :saldo WHERE id = :id', {
                    replacements: { id: id, saldo: (parseFloat(user[0].saldo) + valor).toFixed(2) },
                    type: sequelize_1.QueryTypes.UPDATE
                });
                if (credito.length > 0 && credito[1] == 1) {
                    return [{ 'status': 'success', 'balance': (parseFloat(user[0].saldo) + valor).toFixed(2) }];
                }
                else {
                    return 1; // não foi possivel creditar o usuario
                }
            }
            else {
                return 0; // usuario não encontrado
            }
        });
    }
    paypal() {
        return __awaiter(this, void 0, void 0, function* () {
            var url = 'https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials';
            var request = yield axios({
                url: url,
                method: "post",
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_SECRET
                }
            }).then((response) => {
                return response.data;
            }).catch((err) => {
                return err.message;
            });
            return request;
        });
    }
    stripe({ amount, currency, method }) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = 'https://api.stripe.com/v1/payment_intents';
            var headers = {
                'Authorization': 'Bearer ' + process.env.STRIPE_SECRET,
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            var body = {
                'amount': amount,
                'currency': currency,
                'payment_method_types[]': method
            };
            const params = new URLSearchParams(body);
            var request = yield axios({
                url: url,
                method: "post",
                headers: headers,
                data: params
            }).then((response) => {
                return response.data;
            }).catch((err) => {
                return err.message;
            });
            return request;
        });
    }
    google() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    'clientSecret': process.env.STRIPE_SECRET
                },
            ];
        });
    }
}
exports.default = Carregamento;
