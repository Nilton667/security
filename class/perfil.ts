import 'dotenv/config'
import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import Auth from './auth';
import bcrypt from 'bcrypt';
import fs from 'fs';
import UserData from '../model/userData';

export default class Perfil extends Auth{
    async userData({id}:{id: number}) : Promise<[] | UserData[]>{
        try {
            var select: Array<UserData> = await sequelize.query('SELECT * from usuarios WHERE id = :id',
                {
                    replacements: {id: id},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return select;
            }
            return [];
        } catch (error) {
            console.log(error)
            return [];
        }
    }

    async userUpdate({id, morada}:{id: number, morada: string}){
       
        try {
            var update = await sequelize.query('UPDATE usuarios SET morada = :morada WHERE id = :id',
                {
                    replacements: {id: id, morada: morada},
                    type: QueryTypes.UPDATE
                }
            );

            if(update.length > 0 && update[1] == 1){
                return 1;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async serPermision({id, email, sms, online}:{id: number, email: string, sms: number, online: number}){
        try {
            var update = await sequelize.query('UPDATE usuarios SET notif = :email, sms = :sms, online = :online WHERE id = :id',
                {
                    replacements: {id: id, email: email, sms: sms, online: online},
                    type: QueryTypes.UPDATE
                }
            );

            if(update.length > 0 && update[1] == 1){
                return 1;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async recoverPasswordPerfil(
        {id, email, oldSenha, senha, dispositivo}
        :
        {id: number, email: string, oldSenha: string, senha: string, dispositivo: string}
    ){
        var user = await this.userData({id: id});
        if(user[0].password && bcrypt.compareSync(oldSenha, user[0].password)){
            try {
                //Gerando Hash
                const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
                const hash = bcrypt.hashSync(senha, salt);
                var update = await sequelize.query('UPDATE usuarios SET password = :password WHERE id = :id',
                    {
                        replacements: {
                            id: id,
                            password: hash
                        },
                        type: QueryTypes.UPDATE
                    }
                );
                
                if(update.length > 0 && update[1] == 1){
                    return await this.login({email: email, password: senha, dispositivo: dispositivo});
                }
    
                return 0;
            } catch (error) {
                return error;
            }
        }else{
            return 0;
        }
    }

    async uploadImage({id, imagem}:{id: number, imagem: string}){
        var user = await this.userData({id: id});
        try {
            var update = await sequelize.query('UPDATE usuarios SET imagem = :imagem WHERE id = :id',
                {
                    replacements: {id: id, imagem: imagem},
                    type: QueryTypes.UPDATE
                }
            );
            if(update.length > 0 && update[1] == 1){
                if(user.length > 0){
                    if(user[0].imagem != ''){
                        fs.unlink('./public/img/perfil/'+user[0].imagem, (err)=>{
                            if(err)console.log(err);
                        });
                    }
                }
                return [{'status': 1, 'filename': imagem}];
            }
            return 0;
        } catch (error) {
            return error;
        }
    }
}