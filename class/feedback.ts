import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';

export default class Historico{
    async add({id, nome, email, mensagem}:{id: number, nome: string, email: string, mensagem: string}){
        try {
            
            var query = "INSERT INTO feedback (id_usuario, nome, email, mensagem) VALUES (:id, :nome, :email, :mensagem)";

            var insert = await sequelize.query(query,
                {
                    replacements: {id: id, nome: nome, email: email, mensagem: mensagem},
                    type: QueryTypes.INSERT
                }
            );

            if(insert.length > 0 && insert[1] == 1){
                return 1;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }
}