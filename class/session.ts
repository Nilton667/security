import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import SessionModel from './../model/session.model'
import ResponseModel from '../model/response.model';

export default class Session{
    async getData({id, limite} : SessionModel) : Promise<ResponseModel>{
        try {
            
            if (limite == 0){
                var query = "SELECT * FROM session WHERE user_id = :id ORDER BY id DESC LIMIT 15";
            }else{
                var query = "SELECT * FROM session WHERE id < :limite AND user_id = :id ORDER BY id DESC LIMIT 15";
            }

            var select = await sequelize.query(query,
                {
                    replacements: {id: id, limite: limite},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: select,
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

    async delete({id} : SessionModel) : Promise<ResponseModel>{
        try {
            var query = "DELETE FROM session WHERE id = :id";
            await sequelize.query(query,
                {
                    replacements: {id: id},
                    type: QueryTypes.DELETE
                }
            );
            return <ResponseModel>{
                result: {
                    success: true,
                    data: 'Sessão eliminada com sucesso!',
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