import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import jwt from 'jsonwebtoken';

export default class Online{
    async getData({id}:{id: number}){
        try {
            
            var query = "SELECT * from online WHERE id_usuario = :id ORDER BY id DESC LIMIT 10";
        
            var select = await sequelize.query(query,
                {
                    replacements: {id: id},
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

    async add({id, nome, senha}:{id: number, nome: string, senha: string}){

        var select = await sequelize.query('SELECT id from online WHERE id_usuario = :id',
            {
                replacements: {id: id},
                type: QueryTypes.SELECT
            }
        );

        if(select.length <= 5){
            const chave = jwt.sign({id: id}, senha, { expiresIn: '365days'});
            try {
                
                var query = "INSERT INTO online (id_usuario, nome, chave, senha) VALUES (:id, :nome, :chave, :senha)";
            
                var insert = await sequelize.query(query,
                    {
                        replacements: {
                            id: id, 
                            nome: nome, 
                            chave: chave, 
                            senha: senha
                        },
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
        }else{
            return 6;
        }
    }

    async delete({id}:{id: number}){
        try {
            var query = "DELETE FROM online WHERE id = :id";
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