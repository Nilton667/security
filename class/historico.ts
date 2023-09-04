import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import ResponseModel from '../model/response.model';

export default class Historico{
    async atividades({id, limite}:{id: number, limite: number}){
        try {
            
            if (limite == 0){
                var query = "SELECT * from historic WHERE user_id = :id ORDER BY id DESC LIMIT 15";
            }else{
                var query = "SELECT * from historic WHERE id < :limite AND user_id = :id ORDER BY id DESC LIMIT 15";
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
}