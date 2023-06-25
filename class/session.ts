import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';

export default class Session{
    async getData({id, limite}:{id: number, limite: number}){
        try {
            
            if (limite == 0){
                var query = "SELECT * FROM acesso WHERE id_usuario = :id ORDER BY id DESC LIMIT 15";
            }else{
                var query = "SELECT * FROM acesso WHERE id < :limite AND id_usuario = :id ORDER BY id DESC LIMIT 15";
            }

            var select = await sequelize.query(query,
                {
                    replacements: {id: id, limite: limite},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return select;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async delete({id}:{id: number}){
        try {
            var query = "DELETE FROM acesso WHERE id = :id";
            await sequelize.query(query,
                {
                    replacements: {id: id},
                    type: QueryTypes.DELETE
                }
            );
            return 1;
        } catch (error) {
            return 0;
        }
    }
}