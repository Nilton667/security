import 'dotenv/config'
import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import LoginModel from '../model/login.model';
import jwt from 'jsonwebtoken';
import ResponseModel from '../model/response.model';

export default class Auth{
    async saveLogin({id, time, device, userData} : LoginModel) : Promise<ResponseModel>{
        try {  
            const token = jwt.sign({id: userData![0].id}, process.env.PRIVATE_KEY as string, { expiresIn: '24h'});
            var insert = await sequelize.query('INSERT INTO session (user_id, token, time, device) VALUES (:user_id, :token, :time, :device)',
            {
                replacements: {
                    user_id: id, 
                    token: token,
                    time: time, 
                    device: device, 
                },
                type: QueryTypes.INSERT
            }); 
            if(insert.length > 0 && insert[1] == 1){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: {userData: userData![0], token: token},
                    }
                }
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível iniciar a sua sessão!',
                }
            }  
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            }
        }
    }
}