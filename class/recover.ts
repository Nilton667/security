import { QueryTypes } from "sequelize";
import sequelize from '../config/db';
import UserData from "../model/userData.model";
import Login from "./login";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JwtPayload from '../model/jwtPayload';
import { SendEmail } from "../config/nodemail";
import ResponseModel from "../model/response.model";
import LoginModel from "../model/login.model";
import sendSms from "../config/sendSms";

export default class Recover extends Login{
    async recoverPhone(phone: string) : Promise<ResponseModel> {
        try {
            var select: Array<UserData> = await sequelize.query('SELECT id, name FROM users WHERE phone = :phone',
                {
                    replacements: {phone: phone},
                    type: QueryTypes.SELECT
                }
            );
            if(select.length > 0){

                let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                const token = jwt.sign({id: select[0].id, keycode: keycode}, process.env.PRIVATE_KEY as string, {expiresIn: '1d'});
                
                new sendSms().send(
                    {
                        phone: phone!,
                        message: 'Olá Sr(a) '+select[0].name+', '+keycode+' este é o seu código de recuperação.',
                    }
                );

                return <ResponseModel>{
                    result: {
                        success: true,
                        data: {name: select[0].name, keycode: keycode, token: token},
                    }
                };
            }   
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Nenhum resultado encontrado!',
                }
            };
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }

    async recoverToken({token, keycode}:{token: string, keycode: string}) : Promise<ResponseModel> {
        try {
            var decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as JwtPayload;
            if(decoded.keycode == keycode){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: 'Sucesso!',
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Código invalido!',
                }
            };
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }

    async recoverPassword({phone, password, token, keycode, device} : LoginModel) : Promise<ResponseModel> {
        //Gerando Hash
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
        const hash = bcrypt.hashSync(password!, salt);

        try {
            var decoded = jwt.verify(token!, process.env.PRIVATE_KEY as string) as JwtPayload;
            if(decoded.keycode == keycode){
                var update = await sequelize.query('UPDATE users SET password = :password WHERE phone = :phone AND id = :id',
                    {
                        replacements: {
                            id: decoded.id,
                            phone: phone, 
                            password: hash
                        },
                        type: QueryTypes.UPDATE
                    }
                );
            
                if(update.length > 0 && update[1] == 1){
                    return await this.login({phone: phone, password: password, device: device});
                }
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível atualizar a sua senha!',
                }
            };
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