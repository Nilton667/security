import 'dotenv/config'
import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import Login from './login';
import bcrypt from 'bcrypt';
import fs from 'fs';
import UserData from '../model/userData.model';
import ResponseModel from '../model/response.model';
import UserDataModel from '../model/userData.model';

export default class Perfil extends Login{
    async userData({id} : UserData) : Promise<ResponseModel>{
        try {
            var select: Array<UserData> = await sequelize.query('SELECT * from users WHERE id = :id LIMIT 1',
                {
                    replacements: {id: id},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: select[0],
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

    async recoverPasswordPerfil(
        {id, oldSenha, senha} : {id: number, oldSenha: string, senha: string}
    ) : Promise<ResponseModel> {
        var data = await this.userData({id: id});

        var userData: UserDataModel = data.result?.data as UserDataModel;

        if(userData.password && bcrypt.compareSync(oldSenha, userData.password)){
            try {
                //Gerando Hash
                const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
                const hash = bcrypt.hashSync(senha, salt);
                var update = await sequelize.query('UPDATE users SET password = :password WHERE id = :id',
                    {
                        replacements: {
                            id: id,
                            password: hash
                        },
                        type: QueryTypes.UPDATE
                    }
                );
                
                if(update.length > 0 && update[1] == 1){
                    return <ResponseModel>{
                        result: {
                            success: true,
                            data: 'Senha alterada com sucesso!',
                        }
                    };
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
        }else{
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível atualizar a sua senha!',
                }
            };
        }
    }

    async uploadImage({id, imagem}:{id: number, imagem: string}) : Promise<ResponseModel> {
        var data = await this.userData({id: id});
        var userData: UserDataModel = data.result?.data as UserDataModel;
        try {
            var update = await sequelize.query('UPDATE users SET image = :imagem WHERE id = :id',
                {
                    replacements: {id: id, imagem: imagem},
                    type: QueryTypes.UPDATE
                }
            );
            if(update.length > 0 && update[1] == 1){
            
                if(userData.image != ''){
                    fs.unlink('./public/img/perfil/'+userData.image, (err)=>{
                        if(err)console.log(err);
                    });
                }
                
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: {'image': imagem},
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível atualizar a sua imagem de perfil!',
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