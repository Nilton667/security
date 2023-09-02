import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import FeedbackModel from './../model/feedback.model';
import ResponseModel from './../model/response.model';

export default class Historico{
    async add({id, name, email, message} : FeedbackModel) : Promise<ResponseModel>{
        try {
            
            var query = "INSERT INTO feedback (user_id, name, email, message) VALUES (:user_id, :name, :email, :message)";

            var insert = await sequelize.query(query,
                {
                    replacements: {
                        user_id: id, 
                        name: name, 
                        email: email, 
                        message: message
                    },
                    type: QueryTypes.INSERT
                }
            );

            if(insert.length > 0 && insert[1] == 1){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: 'Feedback enviado com sucesso!',
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível enviar o feedback!',
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