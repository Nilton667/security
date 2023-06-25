import 'dotenv/config'
import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import Perfil from './perfil';
import { AxiosError, AxiosResponse } from 'axios';
const axios = require('axios').default;

export default class Carregamento extends Perfil{
    async deposit({id, amount}:{id: number, amount: string}){
        const valor = parseFloat(amount);
       
        if(typeof valor != 'number'){
            return 'invalid_format';
        }

        var user = await this.userData({id: id});
        if(user.length > 0){

            var credito = await sequelize.query('UPDATE usuarios SET saldo = :saldo WHERE id = :id',
                {
                    replacements: {id: id, saldo: (parseFloat(user[0].saldo!) + valor).toFixed(2)},
                    type: QueryTypes.UPDATE
                }
            );
            
            if(credito.length > 0 && credito[1] == 1){

                return [{'status': 'success', 'balance': (parseFloat(user[0].saldo!) + valor).toFixed(2)}];
                
            }else{
                return 1; // não foi possivel creditar o usuario
            }

        }else{
            return 0; // usuario não encontrado
        }

    }

    async paypal(){
       
        var url = 'https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials';

        var request = await axios({
            url: url,
            method: "post",
            auth:{
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        }).then((response: AxiosResponse)=>{
            return response.data;
        }).catch((err: AxiosError)=>{
            return err.message;
        });

        return request;
  
    }

    async stripe({amount, currency, method} : {amount: string, currency: string, method: string}){
       
        var url = 'https://api.stripe.com/v1/payment_intents';

        var headers = {
            'Authorization': 'Bearer '+process.env.STRIPE_SECRET,
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        var body = {
            'amount': amount,
            'currency': currency,
            'payment_method_types[]': method
        }
        const params = new URLSearchParams(body);

        var request = await axios({
            url: url,
            method: "post",
            headers: headers,
            data: params
        }).then((response: AxiosResponse)=>{
            return response.data;
        }).catch((err: AxiosError)=>{
            return err.message;
        });

        return request;
  
    }

    async google(){
        return [
            {
                'clientSecret': process.env.STRIPE_SECRET
            },
        ]; 
    }
}