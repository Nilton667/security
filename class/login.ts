import { QueryTypes } from 'sequelize';
import sequelize from '../config/db';
import userData from '../model/userData.model';
import Auth from './auth';
import bcrypt from 'bcrypt';
import UserData from '../model/userData.model';
import LoginModel from '../model/login.model';
import ResponseModel from '../model/response.model';

export default class Login extends Auth{
    async loginPhone({phone}:{phone: string}) : Promise<ResponseModel> {
        try {
            var select: Array<UserData> = await sequelize.query('SELECT id from users WHERE phone = :phone',
                {
                    replacements: {phone: phone},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: select[0],
                    }
                }
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Nenhum resultado encontrado!',
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

    async login({phone, password, device} : LoginModel) : Promise<ResponseModel>{
        try {
            var select: Array<userData> = await sequelize.query('SELECT * from users WHERE phone = :phone',
                {
                    replacements: {phone: phone},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                if(bcrypt.compareSync(password!, select[0].password!)){
                    return await this.saveLogin(
                        {
                            id: select[0].id,
                            time: 1, 
                            device: device, 
                            userData: select,
                        }
                    );
                }
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Numero ou senha errada!',
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