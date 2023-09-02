import { QueryTypes } from "sequelize";
import sequelize from '../config/db';
import Login from "./login";
import bcrypt from 'bcrypt';
import UserDataModel from "../model/userData.model";
import {SendEmail} from '../config/nodemail';
import ResponseModel from "../model/response.model";
import sendSms from '../config/sendSms';

export default class Cadastro extends Login{
    async phoneConfirm ({name, phone} : UserDataModel) : Promise<ResponseModel> {
        try {
            var select = await sequelize.query('SELECT id from users WHERE phone = :phone',
                {
                    replacements: {phone: phone},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: 'Já existe uma conta registada com este endereço de email!',
                    }
                };
            }else{

                let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                
                new sendSms().send(
                    {
                        phone: phone!,
                        message: 'Olá Sr(a) '+name+', '+keycode+' este é o seu código de verificação.',
                    }
                );
                
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: keycode,
                    }
                };
            }
            
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }  
    }

    async cadastro(
        {
            name, 
            surname, 
            email, 
            nationality, 
            countrycode, 
            gender, 
            identification, 
            phone, 
            zipcode, 
            password,
            device,
        } : UserDataModel) : Promise<ResponseModel> {
        try {
            var select = await sequelize.query('SELECT id from users WHERE phone = :phone',
                {
                    replacements: {phone: phone},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: 'Já existe uma conta registada com este contacto telefônico!',
                    }
                };
            }else{
                //Gerando Hash
                const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
                const hash = bcrypt.hashSync(password!, salt);

                var insert = await sequelize.query('INSERT INTO users (name, surname, email, countrycode, gender, identification, phone, nationality, zipcode, password) VALUES (:name, :surname, :email, :countrycode, :gender, :identification, :phone, :nationality, :zipcode, :password)',
                    {
                        replacements: {
                            name: name, 
                            surname: surname, 
                            email: email, 
                            countrycode: countrycode, 
                            gender: gender, 
                            identification: identification, 
                            phone: phone, 
                            nationality: nationality,
                            zipcode: zipcode, 
                            password: hash,
                        },
                        type: QueryTypes.INSERT
                    }
                );
                
                if(insert.length > 0 && insert[1] == 1){
                    return await this.login({
                        phone: phone!, 
                        password: password!, 
                        device: device
                    });
                }
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: 'Não foi possível registar a sua conta!',
                    }
                };
            }
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }
}